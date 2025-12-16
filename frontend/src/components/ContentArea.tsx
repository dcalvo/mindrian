import { CollaborativeEditor } from "./CollaborativeEditor";

export function ContentArea() {
  return (
    <main className="content-area">
      <CollaborativeEditor docId="test-doc" />
    </main>
  );
}
