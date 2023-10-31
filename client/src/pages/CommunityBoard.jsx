import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_POSTS } from '../utils/queries';
import { CREATE_POST, ADD_COMMENT } from '../utils/mutations'; 
import moment from 'moment';
import '../styles/CommunityBoard.css';

const CommunityBoard = () => {
  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState('');
  const [openedPostId, setOpenedPostId] = useState(null);

  const { data, loading, error } = useQuery(GET_ALL_POSTS);

  const [createPost] = useMutation(CREATE_POST, {
    refetchQueries: [{ query: GET_ALL_POSTS }],
  });

  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [{ query: GET_ALL_POSTS }],
  });

  const handlePostSubmit = async () => {
    if (newPost.trim() !== '') {
      try {
        await createPost({ variables: { content: newPost } });
        setNewPost('');
      } catch (err) {
        console.error('Error creating post:', err);
      }
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (newComment.trim() !== '') {
      try {
        await addComment({ variables: { postId, content: newComment } });
        setNewComment('');
      } catch (err) {
        console.error('Error adding comment:', err);
      }
    }
  };

  const toggleComments = (postId) => {
    if (openedPostId === postId) {
      setOpenedPostId(null);
    } else {
      setOpenedPostId(postId);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'No timestamp available';
    const formattedDate = moment(Number(timestamp)).format('DD/MM/YY, h:mm a');
    return formattedDate === 'Invalid date' ? 'No timestamp available' : formattedDate;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="community-board">
      <h2>Community Board</h2>
      <div className="post-form">
        <textarea
          rows="4"
          placeholder="Share your eco-action..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button onClick={handlePostSubmit}>Post</button>
      </div>

      <div className="posts">
        {data?.getAllPosts?.map((post) => (
          <div className="post" key={post._id}>
            <div className="post-user">
              <Link to={`/profile/${post?.author?._id}`}>
                <span>{post?.author?.username}</span>
              </Link>
              <div className="post-timestamp">{formatTimestamp(post.timestamp)}</div>
            </div>
            <div className="post-content">
              <p>{post.content}</p>
            </div>

            {/* Show 'See Comments' only if there are comments */}
            {post.comments.length > 0 && (
              <button onClick={() => toggleComments(post._id)}>See Comments</button>
            )}

            {openedPostId === post._id && post.comments.map(comment => (
              <div className="comment" key={comment.timestamp}>
                <span>{comment.author.username}: {comment.content}</span>
                <div>{formatTimestamp(comment.timestamp)}</div>
              </div>
            ))}

            {/* The comment form will always be visible for each post */}
            <div className="comment-form">
              <textarea
                rows="2"
                placeholder="Add your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={() => handleCommentSubmit(post._id)}>Comment</button>
            </div>

          </div>
        ))}
      </div>

      <button className="see-more-btn">See More</button>
    </div>
  );
};

export default CommunityBoard;
