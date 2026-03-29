export function Footer() {
  return (
    <footer className='mt-auto border-t border-gray-200 py-6 text-center text-sm text-gray-400'>
      <p>
        <a
          href='https://github.com/TrulyNotMalware/fileserver'
          className='text-blue-500 hover:underline'
          target='_blank'
          rel='noopener noreferrer'
        >
          http file server
        </a>
        {' (ver:alpha), written by '}
        <a
          href='https://github.com/TrulyNotMalware'
          className='text-blue-500 hover:underline'
          target='_blank'
          rel='noopener noreferrer'
        >
          TrulyNotMalware
        </a>
        {'. 2026'}
      </p>
    </footer>
  );
}
