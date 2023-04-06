"use client";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import styles from "@/styles/Home.module.css";
import Search from "./search/search";

export default function Nav() {
  return (
    <Tabs isFitted variant="soft-rounded" colorScheme="green">
      <TabList>
        <Tab>Search</Tab>
        <Tab>Bookmarks</Tab>
        <Tab>Watched</Tab>
        <Tab>Favorites</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Search />
        </TabPanel>
        <TabPanel>b</TabPanel>
        <TabPanel>c</TabPanel>
        <TabPanel>d</TabPanel>
      </TabPanels>
    </Tabs>
  );
}
