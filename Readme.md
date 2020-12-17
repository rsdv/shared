# @rsdv/shared

Simple shared URI wrapper.

> Currently, only for news articles, but can be used for
> products too in the future

## Sharing sources

- Twitter
- Facebook
- Builtin

## Usage

Calling the url via JS will redirect to the required site

> React

```jsx
<button aria-label={'Share on twitter'} onClick={(e) => {
  window.open('https://share.resdev.co.uk/s/twitter?slug=a-random-news-article', '_blank')
}} />
```
