
// Extending React's HTML input element to support directory selection
import React from 'react';

declare module 'react' {
  interface InputHTMLAttributes<T> extends React.HTMLAttributes<T> {
    webkitdirectory?: boolean;
    directory?: boolean;
  }
}
