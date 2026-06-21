export const handler = async (event) => {
  try {
    if (event.httpMethod === "GET") {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, message: "send-email function is live" }),
      };
    }

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const payload = JSON.parse(event.body || "{}");
    const { to, subject, html, body, replyTo } = payload;
    const emailHtml = html || body;

    if (!to || !subject || !emailHtml) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing to, subject, or html",
          received: payload,
        }),
      };
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.RESEND_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "TBI Progress Tracker <assignments@tbiprogresstracker.org>",
        to,
        subject,
        html: emailHtml,
        reply_to: replyTo || "assignments@tbiprogresstracker.org",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify(data),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
