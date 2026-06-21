const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
try {
const {
to,
subject,
html,
replyTo
} = JSON.parse(event.body);

```
const result = await resend.emails.send({
  from: 'assignments@tbiprogresstracker.org',
  to,
  subject,
  html,
  replyTo
});

return {
  statusCode: 200,
  body: JSON.stringify(result)
};
```

} catch (error) {
return {
statusCode: 500,
body: JSON.stringify({
error: error.message
})
};
}
};
