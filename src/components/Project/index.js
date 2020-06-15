import React, { useEffect } from "react";
import PropTypes from 'prop-types';
import { Descriptions, Card, Checkbox, Rate, Tag, Alert } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import AnimatedShowMore from "react-animated-show-more";

import useFetchTechport from "../../hooks/useFetchTechport";
import useLocalStorage from "../../hooks/useLocalStorage";
import MoreButton from "./MoreButton";


function Project({ item, onLoaded, onSelected }) {
  const [{ data, error, loading }] = useFetchTechport(`/${item.id}`);
  const [favorite, setFavorite] = useLocalStorage(`project_${item.id}`, 0);

  useEffect(() => {
    if (data) onLoaded(item.id, data);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleSelected = ({ target: { checked } }) => {
    onSelected(item.id, checked);
  };

  return (
    <Card
      actions={[
        <Checkbox onChange={handleSelected} checked={item.selected}/>,
        <Rate count={1} value={favorite} onChange={setFavorite} />,
      ]}
      title={data?.project?.title}
      extra={<Tag color="magenta">{data?.project?.status}</Tag>}
      loading={loading}
    >
      {error ? (
        <Alert
          message="Error Retrieving Project"
          description={error.message}
          type="error"
          showIcon
          closable
        />
      ) : (
        <AnimatedShowMore
          height={200}
          toggle={({ isOpen }) => (
            <MoreButton
              shape="round"
              icon={isOpen ? <UpOutlined /> : <DownOutlined />}
            >
              {isOpen ? "Show More..." : "Show Less..."}
            </MoreButton>
          )}
        >
          <Descriptions>
            <Descriptions.Item label="Start Date">
              {data?.project?.startDate}
            </Descriptions.Item>
            <Descriptions.Item label="Last Updated">
              {data?.project?.lastUpdated}
            </Descriptions.Item>
            <Descriptions.Item label="Acronym">
              {data?.project?.acronym}
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={3}>
              {
                <div
                  dangerouslySetInnerHTML={{
                    __html: data?.project?.description,
                  }}
                />
              }
            </Descriptions.Item>
            <Descriptions.Item label="End Date">
              {data?.project?.endDate}
            </Descriptions.Item>
          </Descriptions>
        </AnimatedShowMore>
      )}
    </Card>
  );
}

Project.propTypes = {
  item: PropTypes.object.isRequired,
  onLoaded: PropTypes.func.isRequired,
  onSelected:PropTypes.func.isRequired,
}

export default Project;
