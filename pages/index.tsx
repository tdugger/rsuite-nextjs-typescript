import React, { useRef, useState } from 'react';
import Header from 'next/head';
import Layout from '../components/layout';
import { FlexboxGrid, Input, InputGroup, InputNumber, Checkbox } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import dynamic from 'next/dynamic'
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const padding = {
  paddingLeft: '10px',
  paddingRight: '10px'
};

type Author = {
  key: string,
  name: string,
  works: Work[],
  topWork: string,
  topWorkRevisions: number
}

type Work = {
  title: string,
  revision: number
};

const getAuthorData = async (authorName: string): Promise<Author> => {
  const author: Author = {
    key: '',
    name: '',
    works: [],
    topWork: '',
    topWorkRevisions: 0
  };
  const urlEncodedAuthorName = encodeURIComponent(authorName);
  const authors = await fetch(`https://openlibrary.org/search/authors.json?q=${urlEncodedAuthorName}`);
  const authorsData = await authors.json();

  if (authorsData.numFound && authorsData.numFound > 0) {
    author.key = authorsData.docs[0].key;
    author.name = authorsData.docs[0].name;
    author.topWork = authorsData.docs[0].top_work;

    const worksResponse = await fetch(`https://openlibrary.org/authors/${author.key}/works.json`);
    const worksData = await worksResponse.json();
    author.works = worksData.entries;
  }

  // remove top work from list of works and set top work revisions on author
  const topWork = author.works.find(work => work.title === author.topWork);
  if (topWork) {
    author.topWorkRevisions = topWork.revision;
  }
  author.works.filter(work => work.title !== author.topWork);

  return author;
};

const Home = () => {
  const [authorOne, setAuthorOne] = useState('');
  const [authorTwo, setAuthorTwo] = useState('');
  const [numberWorks, setNumberWorks] = useState(6);
  const [includeTopWork, setIncludeTopWork] = useState(true);
  const [x1Data, setX1Data] = useState(new Array<string>());
  const [y1Data, setY1Data] = useState(new Array<number>());
  const [x2Data, setX2Data] = useState(new Array<string>());
  const [y2Data, setY2Data] = useState(new Array<number>());
  const [a1, setA1] = useState<Author>({} as Author);
  const [a2, setA2] = useState<Author>({} as Author);

  const authorOneInputRef = useRef(null);
  const authorTwoInputRef = useRef(null);

  const searchForAuthorOne = async (event: React.SyntheticEvent<Element, Event>): Promise<void> => {
    const author = await getAuthorData(authorOne);
    setA1(author);
    setData(author, numberWorks, setX1Data, setY1Data, includeTopWork);
    authorOneInputRef.current.value = author.name;
  };

  const searchForAuthorTwo = async (event: React.SyntheticEvent<Element, Event>): Promise<void> => {
    const author = await getAuthorData(authorTwo);
    setA2(author);
    setData(author, numberWorks, setX2Data, setY2Data, includeTopWork);
    authorTwoInputRef.current.value = author.name;
  };

  const setData = (
      author: Author,
      numWorks: number,
      setX: React.Dispatch<React.SetStateAction<string[]>>,
      setY: React.Dispatch<React.SetStateAction<number[]>>,
      includeTop: boolean) => {
    console.log('includeTopWork', includeTop);
    if (!author || !author.works) return;
    const works = author.works.slice(0, numWorks);
    const x = works.map(work => work.title);
    if (includeTop) {
      x.pop();
      x.unshift(author.topWork);
    }
    const y = works.map(work => work.revision);
    if (includeTop) {
      y.pop();
      y.unshift(author.topWorkRevisions);
    }
    setX(x);
    setY(y);
  };

  return (
    <>
      <Header>
        <title>HOME</title>
      </Header>
      <Layout activeKey="home">
        <h3>Author Revision Head to Head</h3>
      </Layout>
      <div className="show-grid">
        <FlexboxGrid justify='center'>
          <FlexboxGrid.Item colspan={4} style={padding}>
            <InputGroup size="md">
              <Input inputRef={authorOneInputRef} placeholder={"Author One"} value={authorOne} onChange={(value) => {
                    const re = /^[A-Za-z\ ]+$/;
                    if (value === "" || re.test(value)) {
                      setAuthorOne(value);
                    }
                }} onPressEnter={searchForAuthorOne} />
              <InputGroup.Button onClick={searchForAuthorOne}>
                <SearchIcon />
              </InputGroup.Button>
            </InputGroup>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={4} style={padding}>
            <InputGroup size="md">
              <Input inputRef={authorTwoInputRef} placeholder={"Author Two"} value={authorTwo} onChange={(value) => {
                    const re = /^[A-Za-z\ ]+$/;
                    if (value === "" || re.test(value)) {
                      setAuthorTwo(value);
                    }
                }} onPressEnter={searchForAuthorTwo} />
              <InputGroup.Button onClick={searchForAuthorTwo}>
                <SearchIcon />
              </InputGroup.Button>
            </InputGroup>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={4} style={padding}>
            <InputNumber size="md" defaultValue='6' min='0' max='10' prefix={<p>Number of Works</p>} onChange={(value) => {
              setNumberWorks(Number(value));
              setData(a1, Number(value), setX1Data, setY1Data, includeTopWork);
              setData(a2, Number(value), setX2Data, setY2Data, includeTopWork);
            }} />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={4} style={padding}>
            <Checkbox defaultChecked={true} onChange={(value, checked, event) => {
              setIncludeTopWork(checked);
              setData(a1, numberWorks, setX1Data, setY1Data, checked);
              setData(a2, numberWorks, setX2Data, setY2Data, checked);
            }}>
              Include Best Seller
            </Checkbox>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </div>
      <div style={{ width: 100 + "%", padding: 100 }}>
        <Plot className='center'
          data={[
            {
              type: 'scatter',  // all "scatter" attributes: https://plot.ly/javascript/reference/#scatter
              x: x1Data,     // more about "x": #scatter-x
              y: y1Data,     // #scatter-y
              marker: {         // marker is an object, valid marker keys: #scatter-marker
                color: 'rgb(255, 0, 0)' // more about "marker.color": #scatter-marker-color
              },
              name: 'Author One'
            },
            {
              type: 'scatter',      // all "bar" chart attributes: #bar
              x: x2Data,     // more about "x": #bar-x
              y: y2Data,     // #bar-y
              xaxis: "x2",
              marker: {         // marker is an object, valid marker keys: #scatter-marker
                color: 'rgb(0, 0, 255)' // more about "marker.color": #scatter-marker-color
              },
              name: 'Author Two'
            }
          ]}
          layout={{
            width: 1000,                 // all "layout" attributes: #layout
            margin: {
              pad: 40,
              l: 100
            },
            xaxis: {                  // all "layout.xaxis" attributes: #layout-xaxis
              title: 'Author One Works',         // more about "layout.xaxis.title": #layout-xaxis-title
              side: 'top',
              color: 'rgb(255, 0, 0)',
            },
            xaxis2: {
              title: 'Author Two Works',         // more about "layout.xaxis.title": #layout-xaxis-title
              color: 'rgb(0, 0, 255)',
              side: 'bottom',
              overlaying: 'x',
            },
            yaxis: {
              title: 'revisions'
            },
          }}
          config={{
            showLink: false,
            displayModeBar: false
          }}
        />
      </div>
    </>
  );
}

export default Home;
