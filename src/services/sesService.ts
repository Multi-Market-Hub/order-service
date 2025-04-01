// /src/services/aws-services/sesService.ts
import {
  SendEmailCommand,
  ListIdentitiesCommand,
  GetIdentityVerificationAttributesCommand,
  VerifyEmailAddressCommand,
  IdentityType,
} from "@aws-sdk/client-ses";
import { sesClient } from "../config/awsConfig";

// Send an email using SES

export const listVerifiedEmails = async (): Promise<string[]> => {
  try {
    // Use the IdentityType enum instead of a string
    const params = { IdentityType: IdentityType.EmailAddress };
    const command = new ListIdentitiesCommand(params);
    const data = await sesClient.send(command);
    const identities = data.Identities || [];

    const verifyCommand = new GetIdentityVerificationAttributesCommand({
      Identities: identities,
    });

    const verifyData = await sesClient.send(verifyCommand);

    const verifiedEmails = identities.filter(
      (identity) =>
        (verifyData.VerificationAttributes ?? {})[identity]
          ?.VerificationStatus === "Success"
    );
    return verifiedEmails;
  } catch (error: any) {
    throw new Error("Failed to fetch verified emails: " + error.message);
  }
};

export const sendVerificationEmail = async (email: string): Promise<string> => {
  try {
    const command = new VerifyEmailAddressCommand({ EmailAddress: email });
    await sesClient.send(command);
    return `Verification email has been sent to ${email}. Please check your inbox.`;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const sendEmail = async (toAddress: string, subject: string, body: string) => {
  const params = {
    Destination: {
      ToAddresses: [toAddress], // Receiver email address
    },
    Message: {
      Body: {
        Text: { Data: body }, // Email body
      },
      Subject: { Data: subject }, // Email subject
    },
    Source: process.env.SOURCE_EMAIL_ADDRESS, // Verified sender email address
  };

  const command = new SendEmailCommand(params);

  try {
    const result = await sesClient.send(command); // Send the email command
    return result;
  } catch (error: any) {
    throw new Error("Error sending email: " + error.message);
  }
};

export { sendEmail };
