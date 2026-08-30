'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import MarkdownRenderer from '@/components/markdown-renderer/MarkdownRenderer';
import { get, post } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';
import { formatChatTimestamp } from '@/utils/dateFormatter';
import { useMutation, useQuery } from '@tanstack/react-query';

import './index.scss';

const HipaaCheckerChat = ({ userUploadId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [conversationId, setConversationId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);

  // Load user preference from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('hipaa-chat-expanded');
    if (savedPreference !== null) {
      setIsExpanded(savedPreference === 'true');
    }
  }, []);

  // Save preference when changed
  useEffect(() => {
    localStorage.setItem('hipaa-chat-expanded', String(isExpanded));
  }, [isExpanded]);

  const { data: userConversations } = useQuery({
    queryKey: ['user-conversations', userUploadId],
    queryFn: async () => {
      const response = await get(`${API_ENDPOINTS.CHAT_USER}/${userUploadId}/conversations?limit=20&offset=0`, false, 3);
      return response.data;
    },
    enabled: !!userUploadId,
    staleTime: 30000, // 30 seconds
  });

  const { data: conversationHistory } = useQuery({
    queryKey: ['conversation-history', conversationId],
    queryFn: async () => {
      if (!conversationId) return null;

      const response = await get(
        `${API_ENDPOINTS.CHAT_CONVERSATION}/${conversationId}/history?limit=50&offset=0`,
        false,
        3
      );
      return response.data;
    },
    enabled: !!conversationId,
    staleTime: 30000, // 30 seconds
  });

  useEffect(() => {
    if (userConversations?.conversations?.length > 0) {
      setConversationId(userConversations.conversations[0].conversation_id);
    }
  }, [userConversations]);

  useEffect(() => {
    if (conversationHistory?.messages) {
      const formattedMessages = conversationHistory.messages.map((msg) => ({
        sender: msg.sender,
        text: msg.content,
        time: formatChatTimestamp(msg.timestamp),
        messageId: msg.message_id,
      }));
      setMessages(formattedMessages);
    }
  }, [conversationHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData) => {
      const response = await post(
        `${API_ENDPOINTS.CHAT_VULNERABILITY}/${userUploadId}`,
        messageData,
        false,
        false,
        3
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.conversation_id && !conversationId) {
        setConversationId(data.conversation_id);
      }

      if (data?.suggestions) {
        setSuggestions(data.suggestions);
      }

      const assistantMessage = {
        sender: 'assistant',
        text: data?.message,
        time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        messageId: data?.message_id,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    },
    onError: (error) => {
      const errorMessage = {
        sender: 'assistant',
        text: `Error: ${error.message || 'Failed to get response'}`,
        time: 'Just Now',
      };
      setMessages((prev) => [...prev, errorMessage]);
    },
  });

  const handleSend = async () => {
    if (!input.trim() || sendMessageMutation.isPending) return;

    const userMessage = {
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    const requestBody = {
      message: currentInput,
    };

    if (conversationId) {
      requestBody.conversation_id = conversationId;
    }

    sendMessageMutation.mutate(requestBody);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  // Keyboard shortcut for expand/collapse
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Cmd+E (Mac) or Ctrl+E (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        toggleExpanded();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isOpen) return null;

  return (
    <div className={`hippa-chat open ${isExpanded ? 'expanded' : 'compact'}`}>
      <div className="hippa-chat__header">
        <div className="hippa-chat__header-left">
          <span className="hippa-chat__title">HIPAA Sage</span>
          <span className="hippa-chat__subtitle">
            I&apos;m HIPAA Sage, your wise companion for comparing options, clarifying regulations, and offering a trusted second opinion.
          </span>
        </div>
        <div className="hippa-chat__header-actions">
          {/* Expand/Collapse Button */}
          <button
            className="hippa-chat__expand-btn"
            onClick={toggleExpanded}
            aria-label={isExpanded ? 'Collapse chat' : 'Expand chat'}
            title={isExpanded ? 'Collapse (Ctrl+E)' : 'Expand (Ctrl+E)'}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
            >
              {isExpanded ? (
                // Collapse icon (arrows pointing inward)
                <>
                  <path d="M14 6L10 10L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M6 6L10 10L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </>
              ) : (
                // Expand icon (arrows pointing outward)
                <>
                  <path d="M10 6L14 10L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M10 6L6 10L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </>
              )}
            </svg>
            <span className="expand-text">
              {isExpanded ? 'Collapse' : 'Expand'}
            </span>
          </button>
          
          {/* Close Button */}
          <button
            className="hippa-chat__close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <Image
              src="/images/icons/chatcross.svg"
              alt="Close"
              width={30}
              height={30}
            />
          </button>
        </div>
      </div>
      <div className="hippa-chat__content">
        <div className="hippa-chat__body">
          {messages.map((msg, idx) => (
            <div key={idx} className={`hippa-chat__message ${msg.sender}`}>
              {msg.sender === 'assistant' && (
                <div className="hippa-chat__sender-wrapper">
                  <Image
                    src="/images/icons/assistant.svg"
                    alt="Assistant"
                    width={40}
                    height={40}
                    className="assistant-icon"
                  />
                  <span className="assistant-name">Assistant</span>
                </div>
              )}
              <div className="hippa-chat__message-content">
                <div className="hippa-chat__bubble">
                  <MarkdownRenderer content={msg.text} />
                </div>
                <div className="hippa-chat__time">{msg.time}</div>
              </div>
            </div>
          ))}

          {sendMessageMutation.isPending && (
            <div className="hippa-chat__message assistant">
              <div className="hippa-chat__sender-wrapper">
                <Image
                  src="/images/icons/assistant.svg"
                  alt="Assistant"
                  width={40}
                  height={40}
                  className="assistant-icon"
                />
                <span className="assistant-name">Assistant</span>
              </div>
              <div className="hippa-chat__message-content">
                <div className="hippa-chat__bubble hippa-chat__typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {suggestions.length > 0 && (
          <div className="hippa-chat__suggestions">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                className="hippa-chat__suggestion-btn"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div className="hippa-chat__input-area">
          <input
            type="text"
            placeholder="Reply..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={sendMessageMutation.isPending}
          />
          <button
            onClick={handleSend}
            disabled={sendMessageMutation.isPending || !input.trim()}
          >
            <Image
              src="/images/icons/send.svg"
              alt="Send"
              width={25}
              height={25}
              className="send-icon"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HipaaCheckerChat;