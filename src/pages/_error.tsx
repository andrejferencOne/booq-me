interface ErrorProps {
  statusCode: number;
}

export default function Error({ statusCode }: ErrorProps) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>{statusCode}</h1>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: { res: { statusCode: number } | null; err: { statusCode: number } | null }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
