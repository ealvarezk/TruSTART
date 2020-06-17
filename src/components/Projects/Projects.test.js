import React from "react";
import { shallow } from "enzyme";
import { List, PageHeader } from "antd";
import mockAxios from "jest-mock-axios";
import { saveAs } from "file-saver";

import Projects from "./Projects";

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

describe("Projects", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  const shallowProjects = () => shallow(<Projects />);

  const shallowProject = (projects) => {
    mockAxios.mockResponse(projectsResponse);

    let list = projects.find(List);
    return shallow(
      <div>
        {list.prop("renderItem")(projectsResponse.data.projects.projects[0])}
      </div>
    ).children();
  };

  const projectsResponse = {
    data: {
      projects: {
        totalCount: 12540,
        projects: [
          { id: 32946, lastUpdated: "2020-6-9" },
          { id: 94227, lastUpdated: "2020-6-5" },
          { id: 11692, lastUpdated: "2020-6-5" },
          { id: 96438, lastUpdated: "2020-6-4" },
          { id: 96439, lastUpdated: "2020-6-4" },
          { id: 94205, lastUpdated: "2020-6-2" },
          { id: 94183, lastUpdated: "2020-6-2" },
          { id: 94884, lastUpdated: "2020-6-1" },
          { id: 13543, lastUpdated: "2020-6-1" },
          { id: 94234, lastUpdated: "2020-5-29" },
          { id: 94233, lastUpdated: "2020-5-29" },
          { id: 94218, lastUpdated: "2020-5-29" },
          { id: 94236, lastUpdated: "2020-5-29" },
          { id: 94240, lastUpdated: "2020-5-21" },
          { id: 10886, lastUpdated: "2020-5-21" },
          { id: 10860, lastUpdated: "2020-5-21" },
        ],
      },
    },
  };

  test("renders Projects properly", () => {
    const projects = shallowProjects();
    
    expect(projects).toMatchSnapshot();
  });

  test("renders Projects properly when error", () => {
    const projects = shallowProjects();
    mockAxios.mockError({ message: "Big Error" });
    expect(projects).toMatchSnapshot();
  });

  test("renders Projects properly when succeed", () => {
    const projects = shallowProjects();
    mockAxios.mockResponse(projectsResponse);
    expect(projects).toMatchSnapshot();
  });

  test("load more click should show more projects", () => {
    const projects = shallowProjects();
    mockAxios.mockResponse(projectsResponse);

    let list = projects.find(List);
    const loadMore = shallow(list.prop("loadMore")).children();
    loadMore.simulate("click");

    list = projects.find(List);

    expect(list.prop("dataSource")).toMatchSnapshot();
  });

  describe("renderItem", () => {
    test("render Project properly", () => {
      const projects = shallowProjects();
      const project = shallowProject(projects);

      expect(project).toMatchSnapshot();
    });

    test("onLoaded should update dataSource", () => {
      const projects = shallowProjects();
      const project = shallowProject(projects);
      project.prop("onLoaded")(32946, { test: "test" });

      const list = projects.find(List);

      expect(list.prop("dataSource")).toMatchSnapshot();
    });

    test("onSelected should update dataSource", () => {
      const projects = shallowProjects();
      const project = shallowProject(projects);
      project.prop("onSelected")(32946, true);

      const list = projects.find(List);

      expect(list.prop("dataSource")).toMatchSnapshot();
    });
  });

  test("on Delete should update dataSource", () => {
    const projects = shallowProjects();
    const project = shallowProject(projects);
    project.prop("onSelected")(32946, true);

    const pageHeader = projects.find(PageHeader);

    const deleteButton = shallow(
      <div>
        {pageHeader.prop('extra')[0]}
      </div>
    ).children();
    deleteButton.simulate('click');

    const list = projects.find(List);
    expect(list.prop("dataSource")).toMatchSnapshot();
  });

  test("on Download should call saveAs", () => {
    const projects = shallowProjects();
    const project = shallowProject(projects);
    project.prop("onSelected")(32946, true);

    const pageHeader = projects.find(PageHeader);

    const downloadButton = shallow(
      <div>
        {pageHeader.prop('extra')[1]}
      </div>
    ).children();
    
    downloadButton.simulate('click');

    expect(saveAs).toHaveBeenCalled();
  });
});
