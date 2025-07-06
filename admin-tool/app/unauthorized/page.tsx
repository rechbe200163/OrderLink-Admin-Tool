export default function UnauthorizedPage({ searchParams }: { searchParams?: { message?: string } }) {
  const message = searchParams?.message ?? 'You do not have permission to access this resource.';
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Unauthorized</h1>
      <p>{message}</p>
    </div>
  );
}
