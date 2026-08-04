import React from 'react'

const icons = {
  rocket: (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.5 1.5a1 1 0 0 1 1 0l2 1.2a1 1 0 0 1 .4.9l-.2 2.1a5 5 0 0 1 1.5 1.5l2.1-.2a1 1 0 0 1 .9.4l1.2 2a1 1 0 0 1 0 1 10 10 0 0 1-7 7 1 1 0 0 1-1 0l-2-1.2a1 1 0 0 1-.9-.4l-.2-2.1A5 5 0 0 1 .6 9.9l2.1-.2a1 1 0 0 1 .9.4l1.2 2a1 1 0 0 1 0 1 10 10 0 0 1 7-7l-1.2-2a1 1 0 0 1-.4-.9L9 2.1a1 1 0 0 1 0-1z"/>
    </svg>
  ),
  video: (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1.5l3-1.5v8l-3-1.5V14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4z"/>
    </svg>
  ),
  image: (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM4 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-1 6l3-4 4 5H3z"/>
    </svg>
  ),
  star: (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.32-.158-.888.283-.95l4.898-.696 2.19-4.327c.197-.39.73-.39.927 0l2.19 4.327 4.898.696c.441.062.612.63.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
    </svg>
  ),
  flame: (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.5 0S6 2 6 4.5A3.5 3.5 0 0 0 10.5 8c.5 0 .5 1 0 1A4.5 4.5 0 0 1 6 4.5C6 1.5 8.5 0 8.5 0z"/>
      <path d="M8 9.5a4.5 4.5 0 0 0 4.5-4.5C12.5 2 8 0 8 0s-2.5 1.5-2.5 5c0 2.5 2.5 4.5 2.5 4.5z"/>
    </svg>
  ),
  trophy: (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 2h1a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3h1v1a3 3 0 0 1-3 3v1a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V6A3 3 0 0 1 0 3V2h2z"/>
    </svg>
  ),
  lock: (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1a3 3 0 0 0-3 3v2H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2V4a3 3 0 0 0-3-3zM6 4a2 2 0 1 1 4 0v2H6V4z"/>
    </svg>
  ),
}

export default function Icon({ name, className = '', style = {}, size = '1.5rem' }) {
  const node = icons[name]
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: size, ...style }}>
      {node || null}
    </span>
  )
}
