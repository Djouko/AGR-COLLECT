#!/usr/bin/env python3
"""
Minimal pyxform HTTP server compatible with ODK Central's xlsform API.
Replaces ghcr.io/getodk/pyxform-http for unified container deployment.
"""

import os
import sys
import tempfile
import traceback
import json

from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


@app.route('/api/v1/convert', methods=['POST'])
def convert():
    """
    Convert XLSForm to XForm XML.
    Accepts raw XLS/XLSX binary as POST body.
    Returns JSON: { "result": "<xml>", "itemsets": "<csv>|null", "warnings": [] }
    """
    from pyxform.xls2xform import xls2xform_convert

    form_id_fallback = request.headers.get('X-XlsForm-FormId-Fallback', '')

    fd, tmp_path = tempfile.mkstemp(suffix='.xlsx')
    output_path = tmp_path.replace('.xlsx', '.xml')

    try:
        with os.fdopen(fd, 'wb') as tmp:
            tmp.write(request.get_data())

        warnings = xls2xform_convert(tmp_path, output_path)
        if warnings is None:
            warnings = []

        with open(output_path, 'r', encoding='utf-8') as f:
            xml_result = f.read()

        # Check for itemsets.csv (generated alongside the XML by pyxform)
        itemsets_path = os.path.join(os.path.dirname(output_path), 'itemsets.csv')
        itemsets = None
        if os.path.exists(itemsets_path):
            with open(itemsets_path, 'r', encoding='utf-8') as f:
                itemsets = f.read()
            os.unlink(itemsets_path)

        return jsonify({
            'result': xml_result,
            'itemsets': itemsets,
            'warnings': warnings
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'warnings': []
        }), 400

    finally:
        for path in [tmp_path, output_path]:
            if os.path.exists(path):
                try:
                    os.unlink(path)
                except OSError:
                    pass


if __name__ == '__main__':
    port = int(os.environ.get('PYXFORM_PORT', 8081))
    print(f'[pyxform] Starting on port {port}...')
    app.run(host='0.0.0.0', port=port)
