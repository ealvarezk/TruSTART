import React, { useState } from "react";
import produce from "immer";
import { saveAs } from "file-saver";
import { PageHeader, Alert, Row, Col, List, Button } from "antd";
import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import Project from "../Project";
import useFetchTechport from "../../hooks/useFetchTechport";
import LoadMoreContainer from "./LoadMoreContainer";
import { PAGE_SIZE, TRUSTAR_LOGO } from "./constants";

function Projects() {
  const [{ data, error, loading }, setData] = useFetchTechport();
  const [projectsRendered, setProjectsRendered] = useState(PAGE_SIZE);

  const handleLoadMore = () => {
    setProjectsRendered(projectsRendered + PAGE_SIZE);
  };

  const handleProjectLoaded = (itemId, projectData) => {
    setData(
      produce(data, (draftData) => {
        const project = draftData.projects.projects.find(
          (item) => item.id === itemId
        );
        project.data = projectData;
      })
    );
  };

  const handleSelected = (itemId, selected) => {
    setData(
      produce(data, (draftData) => {
        const project = draftData.projects.projects.find(
          (item) => item.id === itemId
        );
        project.selected = selected;
      })
    );
  };

  const handleDelete = () => {
    setData(
      produce(data, (draftData) => {
        draftData.projects.projects = draftData.projects.projects.filter(
          (item) => !item.selected
        );
      })
    );
  };

  const handleExport = () => {
    const projectsToExport = data.projects.projects.filter(
      (item) => item.selected
    );
    const blob = new Blob([JSON.stringify(projectsToExport)], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, "projects.txt");
  };

  const loadMore = (
    <LoadMoreContainer>
      <Button onClick={handleLoadMore}>Load more...</Button>
    </LoadMoreContainer>
  );

  return (
    <PageHeader
      title="TruSTAR"
      extra={[
        <Button
          key="delete"
          type="primary"
          shape="circle"
          icon={<DeleteOutlined />}
          onClick={handleDelete}
        />,
        <Button
          key="download"
          type="primary"
          shape="circle"
          icon={<DownloadOutlined />}
          onClick={handleExport}
        />,
      ]}
      avatar={{
        src: TRUSTAR_LOGO,
      }}
    >
      <Row style={{ marginTop: 10 }}>
        <Col span={22} offset={1}>
          {error && (
            <Alert
              message="Error Retrieving Projects"
              description={error.message}
              type="error"
              showIcon
              closable
            />
          )}
          {data && (
            <List
              loading={loading}
              loadMore={loadMore}
              dataSource={data.projects.projects.slice(0, projectsRendered)}
              renderItem={(item) => (
                <Project
                  key={item.id}
                  item={item}
                  onLoaded={handleProjectLoaded}
                  onSelected={handleSelected}
                  selected={item.selected}
                />
              )}
            />
          )}
        </Col>
      </Row>
    </PageHeader>
  );
}

export default Projects;
