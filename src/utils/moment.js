import moment from "moment";

const timeNow = () => {
  return moment().format("YYYY-MM-DD HH:mm:ss");
};

const fromNow = (time) => {
  return moment(time).fromNow();
};

export { timeNow, fromNow };
