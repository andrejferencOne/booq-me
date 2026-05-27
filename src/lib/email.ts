import { Resend } from 'resend';
import { formatBratislavaDateTime } from './timezone';
import { formatPriceFromCents, formatDuration } from './format';

const resend = new Resend(process.env.RESEND_API_KEY);

const SALON = {
  name: 'Samuel Agošton — Barber',
  address: 'Hlavná 12, 811 01 Bratislava',
};

type SendCustomerProps = {
  to: string;
  customerName: string;
  serviceName: string;
  startTime: Date;
  priceCents: number;
  durationMinutes: number;
};

export const sendBookingConfirmationToCustomer = async (props: SendCustomerProps) => {
  const dateTime = formatBratislavaDateTime(props.startTime);

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: props.to,
    subject: `Potvrdenie rezervácie · ${dateTime}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#fff;padding:32px;border-radius:8px">
        <h2 style="font-size:24px;margin-bottom:8px">Tvoja rezervácia je potvrdená ✅</h2>
        <p>Ahoj ${props.customerName},</p>
        <p>ďakujeme za rezerváciu. Tu sú detaily:</p>
        <div style="background:#f3f4f6;padding:16px;border-radius:6px;margin-top:16px">
          <p style="margin:4px 0"><strong>Služba:</strong> ${props.serviceName}</p>
          <p style="margin:4px 0"><strong>Termín:</strong> ${dateTime}</p>
          <p style="margin:4px 0"><strong>Dĺžka:</strong> ${formatDuration(props.durationMinutes)}</p>
          <p style="margin:4px 0"><strong>Cena:</strong> ${formatPriceFromCents(props.priceCents)}</p>
        </div>
        <hr style="margin-top:24px" />
        <p><strong>${SALON.name}</strong><br />${SALON.address}</p>
        <p style="font-size:12px;color:#6b7280;margin-top:24px">
          Ak chceš termín zmeniť alebo zrušiť, napíš nám.
        </p>
      </div>
    `,
  });
};

type SendAdminProps = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  startTime: Date;
  note?: string | null;
};

export const sendNewBookingToAdmin = async (props: SendAdminProps) => {
  const dateTime = formatBratislavaDateTime(props.startTime);

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: process.env.ADMIN_EMAIL!,
    subject: `Nová rezervácia: ${props.customerName} · ${dateTime}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
        <h2 style="font-size:20px">Nová rezervácia</h2>
        <p><strong>Zákazník:</strong> ${props.customerName}</p>
        <p><strong>Email:</strong> ${props.customerEmail}</p>
        <p><strong>Telefón:</strong> ${props.customerPhone}</p>
        <p><strong>Služba:</strong> ${props.serviceName}</p>
        <p><strong>Termín:</strong> ${dateTime}</p>
        ${props.note ? `<p><strong>Poznámka:</strong> ${props.note}</p>` : ''}
      </div>
    `,
  });
};
