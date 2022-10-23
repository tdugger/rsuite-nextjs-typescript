import React, { useState } from 'react';
import Header from 'next/head';
import Layout from '../components/layout';
import { FlexboxGrid, Input, InputGroup, InputNumber, Checkbox, Grid, Row, Col, Container } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';

const padding = {
  paddingLeft: '10px',
  paddingRight: '10px'
};
const center = {
  position: 'fixed',
  textAlign: 'center'
};


const Home = () => { 
  const [searchAuthorOne, setSearchAuthorOne] = useState('');
  const [searchAuthorTwo, setSearchAuthorTwo] = useState('');

  const searchForAuthorOne = (event: React.SyntheticEvent<Element, Event>): void => {
    console.log('searching for author one', searchAuthorOne);
  };

  const searchForAuthorTwo = (event: React.SyntheticEvent<Element, Event>): void => {
    console.log('searching for author two', searchAuthorTwo);
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
              <Input placeholder={"Author One"} value={searchAuthorOne} onChange={setSearchAuthorOne} onPressEnter={searchForAuthorOne}/>
              <InputGroup.Button onClick={searchForAuthorOne}>
                <SearchIcon />
              </InputGroup.Button>
            </InputGroup>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={4} style={padding}>
            <InputGroup size="md"> 
              <Input placeholder={"Author Two"} value={searchAuthorTwo} onChange={setSearchAuthorTwo} onPressEnter={searchForAuthorTwo}/>
              <InputGroup.Button onClick={searchForAuthorTwo}>
                <SearchIcon />
              </InputGroup.Button>
            </InputGroup>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={4} style={padding}>
              <InputNumber size="md" defaultValue='6' prefix={<p>Number of Works</p>} />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={4} style={padding}>
            <Checkbox>Include Best Seller</Checkbox>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </div>
    </>
  );
}

export default Home;
