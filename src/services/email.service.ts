import * as path from "node:path";

import nodemailer, { Transporter } from "nodemailer";
import EmailTemplates from "email-templates";

import { configs } from "../configs";
import { allTemplates } from "../constants";
import { EEmailAction } from "../enums";

class EmailService {
  private transporter: Transporter;
  private templateParser;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: configs.NO_REPLY_EMAIL,
        pass: configs.NO_REPLY_EMAIL_PASSWORD,
      },
    });
    this.templateParser = new EmailTemplates({
      views: {
        root: path.join(process.cwd(), "src", "statics"),
        options: {
          extension: "hbs",
        },
      },
      juice: true,
      juiceResources: {
        webResources: {
          relativeTo: path.join(process.cwd(), "src", "statics", "css"),
        },
      },
    });
  }

  async sendMail(
    email: string,
    emailAction: EEmailAction,
    locals: Record<string, string> = {}
  ) {
    try {
      const templateInfo = allTemplates[emailAction];

      const html = await this.templateParser.render(
        templateInfo.templateName,
        locals
      );

      return this.transporter.sendMail({
        from: "No reply!",
        to: email,
        subject: templateInfo.subject,
        html,
      });
    } catch (e) {
      console.error(e.message);
    }
  }
}

export const emailService = new EmailService();
