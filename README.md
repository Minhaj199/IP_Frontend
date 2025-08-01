# 🧾 Inventory Management System

A minimal inventory management system built with **React**, **TypeScript**, **Tailwind CSS**, and **ShadCN/MUI**. This app allows you to manage products, invoices, and stock operations efficiently.

---

## 🚀 Features

- 📦 **Product Management**
  - Add new products with category, unit, and ID
  - View and manage existing product list

- 🧾 **Invoice System**
  - Create new invoices with multiple products
  - View list of past invoices

- 🔁 **Stock Management**
  - Handle **Stock In** and **Stock Out** entries
  - Include remarks and logs for history tracking

---

## 🛠️ Tech Stack

| Category | Library |
|---------|---------|
| **UI** | React, Tailwind CSS v4, MUI, Lucide Icons |
| **Styling** | @emotion, styled-components, Tailwind Merge |
| **Routing** | React Router DOM v7 |
| **Forms/UI** | Radix UI (`react-select`, `alert-dialog`, etc.), react-select |
| **State/Fetching** | React Query (`@tanstack/react-query`), Axios |
| **Type Safety** | TypeScript |
| **Notifications** | Notistack |

---

## 📂 Project Structure (Overview)

## 🧑‍💻 Getting Started

### Prerequisites

- Node.js (>= 18)
- pnpm / npm / yarn

```bash
git clone https://github.com/Minhaj199/IP_Frontend.git
cd IP_Frontend
pnpm install

# .env

# Base URL for your backend API
VITE_API_BASE_URL=https://your-api-domain.com/api

# Optional: Port (if using custom server settings)
VITE_BACKENT_URL=