import { message } from 'antd';

message.config({
  getContainer: () => document.querySelector('#bhce-safe'),
});

const showError = (error) => {
  message.error(error.toString() || 'Network error');
  if (error.response) {
    ((error.response.data || {}).nonFieldErrors || []).forEach(msg => message.error(msg));
  }
};

const showWarning = (msg) => {
  message.warning(msg);
};

const showSuccess = (msg) => {
  message.success(msg);
};

const isRequired = ({ message = 'Required.' } = {}) => value =>
  (value ? undefined : (message || 'ERROR'));

const isRelativeUrl = ({ message = 'Invalid relative url.' } = {}) => value =>
  value && (/^\/(?!\/)/.test(value) ? undefined : (message || 'ERROR'));

const isUrl = ({ message = 'Invalid url.' } = {}) => value =>
  value && (/^(https?:\/\/|\/(?!\/))/.test(value) ? undefined : (message || 'ERROR'));

const isNumber = ({ message = 'Not a number.' } = {}) => value =>
  value && (/^\d+$/.test(value) ? undefined : (message || 'ERROR'));

const customRegex = ({ message, regex } = {}) => value =>
  value && (regex.test(value) ? undefined : (message || 'ERROR'));

const join = vs => value => vs.reduce((ret, val) => ret || val(value), undefined);

export { showError, showWarning, showSuccess, isRequired, isRelativeUrl, isUrl, isNumber, customRegex, join };
export default { showError, showWarning, showSuccess, isRequired, isRelativeUrl, isUrl, isNumber, customRegex, join };
