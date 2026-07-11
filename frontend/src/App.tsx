import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import "./App.css";
import { createClient, deleteClient, getClients } from "./api";
import type { Client } from "./types";

function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [unitName, setUnitName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadClients() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await getClients();

      setClients(data);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to load clients.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setErrorMessage("Client name is required.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      await createClient({
        name,
        phone,
        unitName,
      });

      setName("");
      setPhone("");
      setUnitName("");

      await loadClients();
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to create client.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      setIsLoading(true);
      setErrorMessage("");

      await deleteClient(id);

      setClients((currentClients) =>
        currentClients.filter((client) => client.id !== id)
      );
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to delete client.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="card">
        <div className="header">
          <div>
            <h1>Dummy Real Estate CRM</h1>
            <p>React + TypeScript frontend connected to Node.js backend.</p>
          </div>

          <button onClick={loadClients} disabled={isLoading}>
            Refresh
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Client Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Example: Ahmed Mohamed"
            />
          </div>

          <div className="field">
            <label>Phone</label>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Example: 01000000000"
            />
          </div>

          <div className="field">
            <label>Unit Name</label>
            <input
              value={unitName}
              onChange={(event) => setUnitName(event.target.value)}
              placeholder="Example: Villa A1"
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Add Client"}
          </button>
        </form>

        {errorMessage && <p className="error">{errorMessage}</p>}

        <div className="clients">
          <h2>Clients</h2>

          {isLoading && clients.length === 0 ? (
            <p>Loading clients...</p>
          ) : clients.length === 0 ? (
            <p>No clients found.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Unit</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td>{client.id}</td>
                      <td>{client.name}</td>
                      <td>{client.phone || "-"}</td>
                      <td>{client.unit_name || "-"}</td>
                      <td>{new Date(client.created_at).toLocaleString()}</td>
                      <td>
                        <button
                          className="danger"
                          onClick={() => handleDelete(client.id)}
                          disabled={isLoading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;