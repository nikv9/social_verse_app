import apiInstance from "../interceptors";

const msgService = {};

msgService.sendMsg = (data) => {
  return apiInstance.post("/msgs", data);
};

msgService.getMsgs = (chatId) => {
  return apiInstance.get(`/msgs/${chatId}`);
};

export default msgService;
