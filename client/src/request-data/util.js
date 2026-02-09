import { computed } from 'vue';
import { identity } from 'ramda';

import Option from '../util/option';

let currentResource;
export const setCurrentResource = (resource) => { currentResource = resource; };

export const computeIfExists = (f) => {
  if (currentResource == null) throw new Error('current resource not found');
  const resource = currentResource;
  return computed(() => (resource.dataExists ? f() : null));
};



////////////////////////////////////////////////////////////////////////////////
// TRANSFORM FUNCTIONS

export function hasVerbs(verbOrVerbs) {
  return !Array.isArray(verbOrVerbs)
    ? this.verbs.has(verbOrVerbs)
    : verbOrVerbs.every(verb => this.verbs.has(verb));
}

/* eslint-disable no-param-reassign */

export const transformForm = (form) => {
  form.nameOrId = form.name != null ? form.name : form.xmlFormId;
  return form;
};

export const transformForms = (response) => {
  const { data } = response;
  for (const form of data)
    transformForm(form);
  return data;
};

/* eslint-enable no-param-reassign */



////////////////////////////////////////////////////////////////////////////////
// SETUP FUNCTIONS

function setToNone() { this.data = Option.none(); }
export const setupOption = (transformData = identity) => ({
  transformResponse: (response) => (response.status === 404
    ? Option.none()
    : Option.of(transformData(response.data))),
  setToNone
});
