const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405 };
  const { to, from, replyTo, subject, learnerName, assignmentText, assignmentDate, trackerUrl } = JSON.parse(event.body);
  try {
    await resend.emails.send({
      from, to, replyTo, subject,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#1a3a5c">New Assignment for ${learnerName}</h2>
          <div style="background:#f8f9fa;border-radius:8px;padding:20px;margin:16px 0">
            <p style="font-size:16px;font-weight:600;margin:0">${assignmentText}</p>
            <p style="color:#6c757d;margin:8px 0 0">Date: ${assignmentDate}</p>
          </div>
          <a href="${trackerUrl}" style="display:inline-block;background:#1B9AD6;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Open Tracker</a>
          <p style="color:#6c757d;font-size:12px;margin-top:24px">Temple Beth Israel Progress Tracker</p>
        </div>
      `
    });
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch(e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
