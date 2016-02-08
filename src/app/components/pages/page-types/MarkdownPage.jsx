import React from 'react';
import MarkdownElement from '../../MarkdownElement';
import markdownString from './markdown-page-contents.md';

const MarkdownPage = () => (
  <MarkdownElement text={markdownString} />
);

export default MarkdownPage;
