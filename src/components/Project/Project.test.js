import React from "react";
import { shallow } from "enzyme";
import { Card } from "antd";
import AnimatedShowMore from "react-animated-show-more";
import mockAxios from "jest-mock-axios";

import { Project } from "./Project";

jest.mock("file-saver", () => ({
  saveAs: jest.fn(),
}));

describe("Project", () => {
  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });

  const defaultProps = {
    item: { id: 32946, lastUpdated: "2020-6-9" },
    onLoaded: jest.fn(),
    onSelected: jest.fn(),
  };

  const shallowProject = (props) =>
    shallow(<Project {...defaultProps} {...props} />);

  const projectResponse = {
    data: {
      project: {
        id: 32946,
        lastUpdated: "2020-06-09",
        title: "Autonomous Systems and Operations",
        acronym: "ASO",
        status: "Active",
        startDate: "Oct 2014",
        endDate: "Sep 2021",
        description:
          "<p>The AES Autonomous Systems and Operations (ASO) project will develop an understanding of the impacts of increasing communication time delays on mission operations, develop autonomy technologies to mitigate the impacts, and infuse them into Human Exploration and Operations systems. The technologies are expected to reduce operations costs as well. This technology has been tested on ISS in FY14-16 as part of the AES Autonomous Mission Operations project; testing continues in FY19-20 under ASO. This technology has also been tested in the Integrated Power, Avionics and Software (IPAS) facility at JSC, and in a testing facility during Exploration Flight Test 1 (EFT-1); tests continue under ASO with ISS and Orion systems and also target infusion into the Artemis-2 mission.<br /> <br /> This project incorporates and builds on the results from the AES Autonomous Mission Operations project.<br /> <br /> Future human spaceflight missions will occur with crews and spacecraft at large distances, with long communication delays to the Earth. The one-way light-time delay to the Moon is 1.3 seconds, which is sufficient to make some scenarios (e.g., landing) difficult or impossible to conduct from Earth. One-way communication delays to human exploration destinations such as Near Earth Asteroids (NEAs) range from seconds to minutes. The one-way light-time delay to Mars ranges from 3 minutes (at conjunction) to 22 minutes (at opposition). As the communication delays increase, the crews in the spacecraft must execute, and manage, much of the mission themselves. Throughout the course of a mission, as distances increase, NASA must continue to migrate operations functionality from the remote Mission Control Center flight control room to the vehicle for use by the crew. The role of the ground control teams and systems will evolve away from real-time support to a more long-range planning, diagnosis, analysis, and prognostics support role, while the vehicle systems and crew must take on the role of onboard daily schedule execution, planning, and systems management. Both ground and vehicle systems will require automation to maximize crew functionality, minimize unnecessary overhead, and reduce operating costs. This project is to understand the impacts of increasing communications time delays on operations and to develop technologies to mitigate the impacts.</p> ",
        benefits:
          "<p>Currently Funded NASA Missions: This technology has the potential to improve the ability of astronauts to perform activities onboard the International Space Station (ISS) more efficiently, thereby increasing their productivity.</p>  <p>Planned NASA missions: This technology is critical to enable human spaceflight missions beyond Low Earth Orbit.</p>  <p>Commercial Space industry: As new companies begin commercial human space operations, be they tourists in Low Earth Orbit or sending crew to and from the Moon, this technology can provide the same benefits of more efficient operations and increased productivity that it provides to NASA.</p> ",
        technologyMaturityStart: "5",
        technologyMaturityCurrent: "7",
        technologyMaturityEnd: "8",
        destinations: ["Earth", "The Moon", "Mars"],
        supportedMissionType: "Projected Mission (Pull)",
        responsibleProgram: "Advanced Exploration Systems Division",
        responsibleMissionDirectorateOrOffice:
          "Human Exploration and Operations Mission Directorate",
        leadOrganization: {
          name: "Ames Research Center",
          type: "NASA Center",
          acronym: "ARC",
          city: "Moffett Field",
          state: "CA",
          country: "United States",
        },
        workLocations: ["Alabama", "California", "Texas"],
        programDirectors: ["Christopher L Moore"],
        projectManagers: ["Jeremy D Frank"],
        website: "",
        libraryItems: [],
        closeoutSummary: "",
        supportingOrganizations: [
          {
            name: "Johnson Space Center",
            type: "NASA Center",
            acronym: "JSC",
            city: "Houston",
            state: "TX",
            country: "United States",
          },
          {
            name: "Marshall Space Flight Center",
            type: "NASA Center",
            acronym: "MSFC",
            city: "Huntsville",
            state: "AL",
            country: "United States",
          },
        ],
        primaryTas: [
          {
            id: 10720,
            code: "TX07",
            title: "Exploration Destination Systems",
            priority: null,
          },
          {
            id: 10732,
            code: "TX07.3",
            title: "Mission Operations and Safety",
            priority: null,
          },
          {
            id: 10734,
            code: "TX07.3.2",
            title: "Integrated Flight Operations Systems",
            priority: null,
          },
        ],
        additionalTas: [],
      },
    },
  };

  const shallowElement = (element) => {
    return shallow(<div>{element}</div>).children();
  };

  test("renders Project properly", () => {
    const project = shallowProject();

    expect(project).toMatchSnapshot();
  });

  test("renders Project properly when error", () => {
    const project = shallowProject();
    mockAxios.mockError({ message: "Big Error" });
    expect(project).toMatchSnapshot();
  });

  test("renders Project properly when succeed", () => {
    const project = shallowProject();
    mockAxios.mockResponse(projectResponse);
    expect(project).toMatchSnapshot();
  });

  describe("AnimatedShowMore", () => {
    test("renders show more toogle properly when open", () => {
      const project = shallowProject();
      const animatedShowMore = project.find(AnimatedShowMore);
      const toggle = shallowElement(
        animatedShowMore.prop("toggle")({ isOpen: true })
      );
      expect(toggle).toMatchSnapshot();
    });

    test("renders show more toogle properly when close", () => {
      const project = shallowProject();
      const animatedShowMore = project.find(AnimatedShowMore);
      const toggle = shallowElement(
        animatedShowMore.prop("toggle")({ isOpen: false })
      );
      expect(toggle).toMatchSnapshot();
    });
  });

  describe("Card", () => {
    test("on Selection call onSelected properly", () => {
      const project = shallowProject();
      const animatedShowMore = project.find(Card);
      const checkbox = shallowElement(
        animatedShowMore.prop("actions")[0]
      );
      checkbox.prop('onChange')({target: {checked: true}});
      expect(defaultProps.onSelected).toHaveBeenCalledWith(projectResponse.data.project.id, true);
    });

    test("on Favorite set favorite properly", () => {
      const project = shallowProject();
      let animatedShowMore = project.find(Card);
      let rate = shallowElement(
        animatedShowMore.prop("actions")[1]
      );
      rate.prop('onChange')(1);

      animatedShowMore = project.find(Card);
      rate = shallowElement(
        animatedShowMore.prop("actions")[1]
      );
      expect(rate.prop('value')).toBe(1);
    });
  });
});
