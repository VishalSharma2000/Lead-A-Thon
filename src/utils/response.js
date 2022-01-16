const serverError = (res, error) => {
  return res.status(500).json({ data: null, error, errorMsg: "Server Error" });
}

const clientError = (res, error) => {
  return res.status(400).json({ data: null, error, errorMsg: "Bad Request"});
}

const success = (res, data) => {
  return res.status(200).json({ data, error: null, errorMsg: null })
}

module.exports = {
  serverError,
  clientError,
  success
}