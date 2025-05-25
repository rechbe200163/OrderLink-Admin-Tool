import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface NotificationEmailProps {
  type: 'email' | 'password';
  username: string;
  changeTime: string;
}

export const NotificationEmail = ({
  type,
  username,
  changeTime,
}: NotificationEmailProps) => {
  const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <Html>
      <Head />
      <Preview>{typeCapitalized} Change Notification</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{typeCapitalized} Change Notification</Heading>
          <Text style={text}>Hello {username},</Text>
          <Text style={text}>
            This is to inform you that your {type} was changed on {changeTime}.
          </Text>
          <Text style={text}>
            If you did not make this change, please contact our support team
            immediately.
          </Text>
          <Section style={buttonContainer}>
            <Button
              style={button}
              href='https://your-app-url.com/contact-support'
            >
              Contact Support
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            If you have any questions, please don&apos;t hesitate to{' '}
            <Link href='mailto:support@your-app.com' style={link}>
              contact us
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '560px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  paddingTop: '32px',
  paddingBottom: '32px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
};

const buttonContainer = {
  padding: '27px 0 27px',
};

const button = {
  backgroundColor: '#0070f3',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};

const link = {
  color: '#0070f3',
};

export default NotificationEmail;
