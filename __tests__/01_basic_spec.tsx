import React, { Suspense } from 'react';
import { render, cleanup } from '@testing-library/react';

import { prefetch, useFetch } from '../src/index';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('basic spec', () => {
  afterEach(cleanup);

  it('should have a function', () => {
    expect(prefetch).toBeDefined();
    expect(useFetch).toBeDefined();
  });

  it('should create a component', async () => {
    fetchMock.mockResponse(JSON.stringify({ str: 'test data' }));
    const fetchUrl = async (url: string) => (await fetch(url)).json();
    const suspendable = prefetch(fetchUrl, 'http://...');
    const DisplayData = () => {
      const { result } = useFetch(suspendable);
      return <span>Data: {result.str}</span>;
    };
    const App = () => (
      <Suspense fallback={<span>Loading...</span>}>
        <DisplayData />
      </Suspense>
    );
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
    await sleep(10); // not ideal...
    expect(container).toMatchSnapshot();
  });
});
