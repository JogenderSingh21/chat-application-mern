export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return diffDates(messages, m, i, userId) ? 3 : 39;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 3;
  else return "auto";
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

const compDates = (a, b) => {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return d1.toDateString() == d2.toDateString();
};

export const isShowDate = (messages, m, i) => {
  if (i == 0) {
    return true;
  }
  // console.log(
  //   messages[i - 1].updatedAt,
  //   messages[i].updatedAt,
  //   compDates(messages[i - 1].updatedAt, messages[i].updatedAt)
  // );
  return !compDates(messages[i - 1].updatedAt, m.updatedAt);
  // return compDates(messages[i - 1].updatedAt, messages[i].updatedAt);
};

export const diffDates = (messages, m, i, userId) => {
  if (m.sender._id == userId) return false;
  if (i == messages.length) return true;
  return !compDates(m.updatedAt, messages[i + 1].updatedAt);
};
