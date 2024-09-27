import { Outlet } from 'react-router-dom';
import { Layout } from '../layout';

export default function BlogLayout() {
  return (
    <div className="d-flex flex-column h-100 w-100">
      <Layout>
        <div className="container mt-3">
          <Outlet />
        </div>
      </Layout>
    </div>
  );
}
