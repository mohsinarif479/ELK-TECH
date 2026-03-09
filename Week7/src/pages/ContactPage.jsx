import { useState } from "react";

function ContactPage() {
  const [formData, setFormData] = useState({ name: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section>
      <h2>Contact</h2>
      <form onSubmit={handleSubmit} className="card">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" value={formData.name} onChange={handleChange} required />

        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
        />

        <button type="submit">Submit</button>
      </form>

      {submitted && <p>Thanks {formData.name}, your message has been captured locally.</p>}
    </section>
  );
}

export default ContactPage;
