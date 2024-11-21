export default function RequestsPage() {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">My Requests</h2>
        <div className="rounded-lg border bg-card">
          <div className="p-6 text-center text-muted-foreground">
            No requests found.
          </div>
        </div>
      </div>
    );
  }