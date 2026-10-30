#!/usr/bin/env python3
"""
Minimal pyxform HTTP server compatible with ODK Central's xlsform API.

ODK Central calls:
  POST /api/v1/convert
  Headers: X-XlsForm-FormId-Fallback
  Body: XLS/XLSX binary (raw body, NOT multipart)

Expected response (200):
  { "result": "<xml>", "itemsets": "<csv>|null", "warnings": [] }

Compatibility notes:
  - pyxform.xls2xform.xls2xform_convert requires a file path; we wrap stdin
    in a temp file.
  - The formIdFallback is injected when provided: instead of relying on the
    XLS' form_id cell, we pre-process by patching the settings sheet if
    present, and post-process by patching the produced XML's instance id.
  - Uses tempfile.mkdtemp() so pyxform can also write its sibling
    itemsets.csv alongside the output XML.
"""

import logging
import os
import sys
import tempfile
import traceback
import xml.etree.ElementTree as ET

from flask import Flask, request, jsonify

logging.basicConfig(
    level=logging.INFO,
    format='[pyxform] %(asctime)s %(levelname)s %(message)s',
    stream=sys.stdout,
)
log = logging.getLogger('pyxform')

app = Flask(__name__)


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


def _set_form_id_fallback_in_xlsx(xlsx_path: str, form_id: str) -> None:
    """
    Best-effort: if the xlsx has a settings sheet with a form_id column,
    fill the first data-row cell with the provided fallback id. If anything
    fails (legacy .xls, no settings sheet, etc.), silently skip — the
    XML-level fallback below is the authoritative fix.
    """
    try:
        from openpyxl import load_workbook
    except ImportError:
        log.warning("openpyxl not installed; skipping form_id pre-injection")
        return

    try:
        wb = load_workbook(xlsx_path)
    except Exception as e:
        log.info(f"could not open XLS/XLSX for id injection: {e}")
        return

    if 'settings' not in wb.sheetnames:
        return

    sheet = wb['settings']
    try:
        headers = [cell.value for cell in sheet[1]]
        col = headers.index('form_id')
    except (ValueError, IndexError):
        return

    cell = sheet.cell(row=2, column=col + 1)
    if cell.value is None or str(cell.value).strip() == '':
        cell.value = form_id
        try:
            wb.save(xlsx_path)
        except Exception as e:
            log.warning(f"could not save xlsx with form_id: {e}")


def _apply_fallback_to_xform(xml_text: str, form_id: str) -> str:
    """
    If the produced XForm's <model><instance><data id=""> is missing or
    empty, fill it with the fallback form id.
    """
    if not form_id:
        return xml_text
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError:
        return xml_text
    for child in root.iter():
        if child.tag.endswith('instance'):
            for inst in list(child):
                if not inst.attrib.get('id'):
                    inst.attrib['id'] = form_id
                    return ET.tostring(root, encoding='unicode')
    return xml_text


@app.route('/api/v1/convert', methods=['POST'])
def convert():
    raw = request.get_data()
    form_id_fallback = (request.headers.get('X-XlsForm-FormId-Fallback') or '').strip()

    if not raw:
        return jsonify({
            'error': 'empty request body; expected XLS/XLSX binary',
            'warnings': []
        }), 400

    log.info(f"convert request bytes={len(raw)} fallback={form_id_fallback!r}")

    tmp_dir = tempfile.mkdtemp(prefix='pyxform-')
    xls_path = os.path.join(tmp_dir, 'input.xlsx')
    xml_path = os.path.join(tmp_dir, 'output.xml')

    try:
        with open(xls_path, 'wb') as f:
            f.write(raw)

        if form_id_fallback:
            _set_form_id_fallback_in_xlsx(xls_path, form_id_fallback)

        from pyxform.xls2xform import xls2xform_convert
        warnings = xls2xform_convert(xls_path, xml_path) or []

        if not os.path.exists(xml_path):
            raise RuntimeError('pyxform did not produce the XML output file')

        with open(xml_path, 'r', encoding='utf-8') as f:
            xml_result = f.read()

        xml_result = _apply_fallback_to_xform(xml_result, form_id_fallback)

        itemsets_path = os.path.join(tmp_dir, 'itemsets.csv')
        itemsets = None
        if os.path.exists(itemsets_path):
            with open(itemsets_path, 'r', encoding='utf-8') as f:
                itemsets = f.read()

        log.info(f"convert ok warnings={len(warnings)} itemsets={'yes' if itemsets else 'no'}")
        return jsonify({
            'result': xml_result,
            'itemsets': itemsets,
            'warnings': warnings,
        })

    except Exception as e:
        log.error(f"convert failed: {e}\n{traceback.format_exc()}")
        return jsonify({
            'error': str(e),
            'warnings': []
        }), 400

    finally:
        for path in [xls_path, xml_path, os.path.join(tmp_dir, 'itemsets.csv')]:
            try:
                if os.path.exists(path):
                    os.unlink(path)
            except OSError:
                pass
        try:
            os.rmdir(tmp_dir)
        except OSError:
            pass


if __name__ == '__main__':
    port = int(os.environ.get('PYXFORM_PORT', 8081))
    log.info(f"Starting on port {port}...")
    app.run(host='0.0.0.0', port=port, use_reloader=False)
