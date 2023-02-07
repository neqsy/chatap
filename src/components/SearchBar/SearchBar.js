import React from "react";
import { Form } from "react-bootstrap";

export default function SearchBar({ searchKeyword, setSearchKeyword }) {
  return (
    <Form.Control
      type="text"
      id="search"
      placeholder="Search chat..."
      value={searchKeyword}
      onChange={(e) => setSearchKeyword(e.target.value)}
    />
  );
}
