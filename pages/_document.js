import Document from 'next/document';
import withTwindDocument from '@twind/next/document';
import twindConfig from '../twind.config';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }
}

export default withTwindDocument(twindConfig, MyDocument);
