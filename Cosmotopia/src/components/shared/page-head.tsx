import { Helmet } from 'react-helmet-async';

export default function PageHead({ title = 'Cosmo' }) {
  return (
    <Helmet>
      <title> {title} </title>
    </Helmet>
  );
}
