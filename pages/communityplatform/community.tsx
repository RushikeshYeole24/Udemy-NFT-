/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, doc } from 'firebase/firestore';

// Firebase initialization
const firebaseConfig = {
  apiKey: "AIzaSyCSH2-DLIhi9gHgoDxJt5yB_cB4n8Mwhww",
  authDomain: "nft-forum-inscribe.firebaseapp.com",
  projectId: "nft-forum-inscribe",
  storageBucket: "nft-forum-inscribe.appspot.com",
  messagingSenderId: "68272686535",
  appId: "1:68272686535:web:4c3faf4ac1365c386445e2",
  measurementId: "G-ZBEL69S239"
};

// Initialize Firebase app and Firestore
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: any;
  upvotes: number;
  downvotes: number;
  comments: Array<{ author: string, content: string, timestamp: any }>;
}

// Avatar component for user profile pictures
const Avatar: React.FC<{ author: string }> = ({ author }) => {
  return (
    <div style={{
      borderRadius: '50%',
      backgroundColor: '#0079d3',
      width: '40px',
      height: '40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      fontWeight: 'bold',
      marginRight: '10px'
    }}>
      {author[0].toUpperCase()}
    </div>
  );
};

// Comment component for displaying user comments
const Comment: React.FC<{ comment: { author: string, content: string, timestamp: any } }> = ({ comment }) => (
  <div style={{ padding: '10px 0', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
    <Avatar author={comment.author} />
    <div>
      <strong>{comment.author}</strong>: {comment.content}
      <small style={{ fontSize: '12px', color: '#999', marginLeft: '10px' }}>{comment.timestamp?.toDate().toLocaleString()}</small>
    </div>
  </div>
);

// InputField component for posting messages or comments
const InputField: React.FC<{ placeholder: string, value: string, onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>, onSubmit: () => void }> = ({ placeholder, value, onChange, onSubmit }) => (
  <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        fontSize: '16px',
        marginBottom: '10px'
      }}
    />
    <button onClick={onSubmit} style={{
      backgroundColor: '#ff4500',
      color: '#fff',
      padding: '10px 15px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      alignSelf: 'flex-end',
      transition: 'background-color 0.3s ease'
    }}>
      Post
    </button>
  </div>
);

// Message component for displaying user messages with voting and commenting features
const Message: React.FC<{
  message: Message,
  upvote: (id: string, currentUpvotes: number) => void,
  downvote: (id: string, currentDownvotes: number) => void,
  addComment: (id: string, commentContent: string) => void,
  comment: string,
  setComment: React.Dispatch<React.SetStateAction<string>>
}> = ({ message, upvote, downvote, addComment, comment, setComment }) => (
  <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Avatar author={message.author} />
      <div style={{ flexGrow: 1 }}>
        <strong style={{ fontSize: '16px', color: '#0079d3' }}>{message.author}</strong>
        <p style={{ fontSize: '14px', color: '#333' }}>{message.content}</p>
        <small style={{ fontSize: '12px', color: '#999' }}>{message.timestamp?.toLocaleString()}</small>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button onClick={() => upvote(message.id, message.upvotes)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#ff4500' }}>
          ▲
        </button>
        <div style={{ fontSize: '14px', color: '#333' }}>{message.upvotes - message.downvotes}</div>
        <button onClick={() => downvote(message.id, message.downvotes)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#ff4500' }}>
          ▼
        </button>
      </div>
    </div>
    <div style={{ marginTop: '10px' }}>
      {message.comments.map((comment, idx) => (
        <Comment key={idx} comment={comment} />
      ))}
      <input
        type="text"
        placeholder="Add a comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{ width: '100%', padding: '8px', marginTop: '10px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '14px' }}
      />
      <button onClick={() => addComment(message.id, comment)} style={{
        backgroundColor: '#ff4500',
        color: '#fff',
        padding: '8px 12px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        marginTop: '10px'
      }}>
        Comment
      </button>
    </div>
  </div>
);

// Main CommunityForum component
const CommunityForum: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [author, setAuthor] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    const q = query(collection(firestore, 'messages'), orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
        comments: doc.data().comments || [],
      } as Message));

      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!author || !content) return;

    await addDoc(collection(firestore, 'messages'), {
      author,
      content,
      timestamp: serverTimestamp(),
      upvotes: 0,
      downvotes: 0,
      comments: [],
    });
    setContent('');
  };

  const upvote = async (id: string, currentUpvotes: number) => {
    const messageRef = doc(firestore, 'messages', id);
    await updateDoc(messageRef, {
      upvotes: currentUpvotes + 1,
    });
  };

  const downvote = async (id: string, currentDownvotes: number) => {
    const messageRef = doc(firestore, 'messages', id);
    await updateDoc(messageRef, {
      downvotes: currentDownvotes + 1,
    });
  };

  const addComment = async (id: string, commentContent: string) => {
    if (!author || !commentContent) return;

    const messageRef = doc(firestore, 'messages', id);
    const messageData = messages.find(msg => msg.id === id);

    const newComment = {
      author,
      content: commentContent,
      timestamp: null,
    };

    const updatedComments = [
      ...messageData!.comments || [],
      newComment,
    ];

    await updateDoc(messageRef, {
      comments: updatedComments,
    });

    setComment('');
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '40px 20px', backgroundColor: '#f9f9f9' }}>
      <h1 style={{ color: '#333', marginBottom: '20px', textAlign: 'center' }}>Community Forum</h1>
      <InputField
        placeholder="Enter your name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        onSubmit={sendMessage}
      />
      <InputField
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onSubmit={sendMessage}
      />
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          upvote={upvote}
          downvote={downvote}
          addComment={addComment}
          comment={comment}
          setComment={setComment}
        />
      ))}
    </div>
  );
};

export default CommunityForum;
