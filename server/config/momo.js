module.exports = {
  partnerCode: "MOMO",
  accessKey: "F8BBA842ECF85",
  secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
  redirectUrl: "http://localhost:3000/payment/momo-redirect", // giả định frontend ở cổng 3000
  ipnUrl: "http://localhost:5000/api/momo/ipn", // backend localhost
  endpoint: "https://test-payment.momo.vn/v2/gateway/api/create",
};
