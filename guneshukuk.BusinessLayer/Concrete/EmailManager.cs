using guneshukuk.BusinessLayer.Abstract;
using guneshukuk.EntityLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace guneshukuk.BusinessLayer.Concrete
{
    public class EmailManager : IEmailService
    {
        public void SendBookingConfirmationEmail(Booking booking)
        {
            try
            {
                // Gönderici e-posta hesap bilgileri
                string senderEmail = "vli.kcc@hotmail.com";
                string senderPassword = "kcc.19.vli";

                // Alıcı e-posta adresi
                string recipientEmail = booking.BookingEmail; // Varsayılan olarak Booking içinde CustomerEmail özelliği kullanıldı.

                // E-posta başlığı ve içeriği
                string subject = "Booking Confirmation";
                string body = $"Dear {booking.BookingName},\n\nYour booking has been confirmed. Thank you for choosing our service!\n\nBooking Details:\n\nDate: {booking.BookingDate}\nMessage: {booking.BookingMessage}";

                // SMTP istemcisini oluştur
                using (SmtpClient client = new SmtpClient("smtp-mail.outlook.com"))
                {
                    // SMTP sunucusu ve bağlantı ayarları
                    client.Port = 587;
                    client.Credentials = new NetworkCredential(senderEmail, senderPassword);
                    client.EnableSsl = true;

                    // E-posta mesajını oluştur
                    MailMessage message = new MailMessage(senderEmail, recipientEmail, subject, body);
                    message.IsBodyHtml = true; // İçerik HTML formatında

                    // E-postayı gönder
                    client.Send(message);
                    Console.WriteLine("E-posta başarıyla gönderildi.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("E-posta gönderiminde hata oluştu: " + ex.Message);
            }

        }
    }
}
