import toast from 'react-hot-toast';

export const getErrorMessage = (error: any) => {
  if (error?.shortMessage) {
    return error?.shortMessage;
  }
  if (error?.message) {
    if (error?.request?.status === 401) {
      return 'Your Session Expired, Please Login Again!';
    }
    if (error?.request?.status >= 500) {
      return error?.request?.statusText;
    } else {
      const message: any = [];
      if (error?.response?.data?.message) {
        message.push(error?.response?.data?.message);
      } else {
        for (const key in error?.response?.data) {
          console.log('key', key);
          if (typeof error?.response?.data[key] === 'object') {
            console.log('in if', error?.response?.data[key]);

            error?.response?.data[key].forEach((element: any) => {
              if (typeof element === 'object') {
                message.push(element.msg);
              } else {
                message.push(element);
              }
            });
          } else {
            console.log('in else', error?.response?.data[key]);
            message.push(error?.response?.data[key]);
          }
        }
      }
      if (message.length === 0) {
        return error?.message;
      } else {
        return message;
      }
    }
  }
  return error;
};

export const throwErrorMessage = async (error: any) => {
  const message = getErrorMessage(error);
  if (typeof message == 'object') {
    for (const msg of message) {
      toast.error(msg, {
        id: msg
      });
    }
  } else {
    toast.error(message, {
      id: message
    });
  }
};
