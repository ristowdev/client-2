/* eslint-disable react/react-in-jsx-scope */
import Document, { Head, Html, Main, NextScript, } from 'next/document';
import { ServerStyleSheet } from "styled-components";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8"/>
          <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
          <link rel="icon" href=""/>
          <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700" rel="stylesheet"
                type="text/css"/>
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
          <link rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css"/>
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css"/>
          <link href="/assets/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
          <link href="/assets/plugins/material/material.min.css" rel="stylesheet"/>
          <link href="/assets/css/material_style.css" rel="stylesheet"/>
          <link href="/assets/plugins/morris/morris.css" rel="stylesheet" type="text/css"/>
          <link href="/assets/css/style.css" rel="stylesheet" type="text/css"/>
          <link href="/assets/css/plugins.min.css" rel="stylesheet" type="text/css"/>
          <link href="/assets/css/pages/typography.css" rel="stylesheet" type="text/css"/>
          <link href="/assets/css/responsive.css" rel="stylesheet" type="text/css"/>
          <link href="/assets/css/theme-color.css" rel="stylesheet" type="text/css"/>
          <link href="/assets/css/pages/extra_pages.css" rel="stylesheet" type="text/css"/>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
          <link rel="manifest" href="/site.webmanifest"/>
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
          <meta name="msapplication-TileColor" content="#da532c"/>
          <meta name="theme-color" content="#ffffff"/>
          {/* <link rel="stylesheet" href="https://kendo.cdn.telerik.com/themes/5.6.0/default/default-main.css"></link>
          <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" /> */}

        </Head>
        <body
          className="page-header-fixed sidemenu-closed-hidelogo page-content-white page-md header-white dark-color logo-dark">
        <Main/>
        <NextScript/>
        </body>

        <script src="/assets/plugins/jquery/jquery.min.js"></script>
        <script src="/assets/plugins/popper/popper.min.js"></script>
        <script src="/assets/plugins/jquery-blockui/jquery.blockui.min.js"></script>
        <script src="/assets/plugins/jquery-slimscroll/jquery.slimscroll.js"></script>

        <script src="/assets/plugins/bootstrap/js/bootstrap.min.js"></script>

        <script src="/assets/plugins/counterup/jquery.waypoints.min.js"></script>
        <script src="/assets/plugins/counterup/jquery.counterup.min.js"></script>

        <script src="/assets/js/app.js"></script>
        <script src="/assets/js/layout.js"></script>
        <script src="/assets/js/theme-color.js"></script>

        <script src="/assets/plugins/material/material.min.js"></script>
      </Html>
    )
  }
}

export default MyDocument
