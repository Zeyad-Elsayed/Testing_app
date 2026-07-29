import type { Client, CreateClientInput } from "./types";

export async function getClients(): Promise<Client[]> {
  const response = await fetch("/api/clients");

  if (!response.ok) {
    throw new Error("Failed to fetch clients");
  }

  return response.json();
}

export async function createClient(data: CreateClientInput): Promise<Client> {
  const response = await fetch("/api/clients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create client");
  }

  return response.json();
}

export async function deleteClient(id: number): Promise<void> {
  const response = await fetch(`/api/clients/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete client");
  }
}