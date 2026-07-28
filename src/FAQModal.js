import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const faqItems = [
  {
    id: 1,
    question: "What is Docker?",
    answer:
      "Docker is a platform for developing, shipping, and running applications in lightweight containers. Containers package your app with its dependencies so it runs consistently across environments.",
  },
  {
    id: 2,
    question: "How do I start a container?",
    answer:
      "Use docker run followed by an image name, for example: docker run -p 8080:80 nginx. The -p flag maps a host port to the container port.",
  },
  {
    id: 3,
    question: "What is the difference between an image and a container?",
    answer:
      "An image is a read-only template with instructions for creating a container. A container is a running instance of an image — you can start, stop, and delete containers while images remain on disk.",
  },
  {
    id: 4,
    question: "How do I build a custom Docker image?",
    answer:
      "Create a Dockerfile in your project, then run docker build -t my-app . from that directory. Docker reads the Dockerfile and produces an image tagged as my-app.",
  },
  {
    id: 5,
    question: "What is Docker Compose used for?",
    answer:
      "Docker Compose defines and runs multi-container applications. You describe services in a compose.yaml file and use docker compose up to start them together.",
  },
  {
    id: 6,
    question: "How do I view running containers?",
    answer:
      "Run docker ps to list running containers. Add -a to see stopped containers as well. Use docker logs <container> to inspect output from a specific container.",
  },
];

const FAQModal = ({ isOpen, onClose }) => {
  const [openId, setOpenId] = useState(null);
  const navigate = useNavigate();

  const handleToggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const handleGoToFAQPage = () => {
    navigate("/faq");
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="faq-modal-overlay" onClick={onClose}>
      <div className="faq-modal" onClick={(e) => e.stopPropagation()}>
        <div className="faq-modal-header">
          <h2 className="faq-modal-title">Frequently Asked Questions</h2>
          <button 
            className="faq-modal-close-btn"
            onClick={onClose}
            aria-label="Close FAQ modal"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        <div className="faq-modal-content">
          <div className="faq-list">
            {faqItems.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`faq-item${isOpen ? " faq-item--open" : ""}`}
                >
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => handleToggle(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                  >
                    <span>{item.question}</span>
                    <i
                      className={`fa-solid fa-chevron-down faq-chevron${
                        isOpen ? " faq-chevron--open" : ""
                      }`}
                    ></i>
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-answer-${item.id}`}
                      className="faq-answer"
                      role="region"
                    >
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="faq-modal-footer">
          <button
            className="faq-modal-view-full-btn"
            onClick={handleGoToFAQPage}
          >
            View Full FAQ Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQModal;