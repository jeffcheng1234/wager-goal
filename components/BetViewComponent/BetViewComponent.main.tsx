import React from "react";
import { View } from "react-native";
import { Avatar, Card, Paragraph } from "react-native-paper";
import { BetModel } from "../../models/bet";
import { BetViewComponentStyles } from "./BetViewComponent.styles";

export const BetView = ({
  navigation,
  userPics,
}: {
  navigation: any;
  userPics: any;
}) => {
  return ({ item }: { item: BetModel }) => {
    const onPress = () => {
      navigation.navigate("BetDetailScreen", {
        bet: item,
      });
    };

    //shouldn't be needed but some of the firebase entries don't have a date
    if (item.date_start.toDate === undefined) {
      return <></>;
    }

    const BottomRowTitle = () => {
      if (item.invited_users.length !== 0) {
        return(<Paragraph>Invited Users</Paragraph>);
      } else {
        return (<></>);
      }
    }

    return (
      <Card onPress={onPress} style={{ margin: 8 }}>
        {/* <Card.Title
              title={<Text>
                {userPics?.get(item.creator)?.name + " started a new bet: \n\n" + item.bet_name}
            </Text>}
              subtitle={ item.bet_name + "\n" +
                item.bet_desc + " • " + new Date(item.date_end).toLocaleString()
              }
              left = {() => <Avatar.Image size={40} source={{ uri: userPics?.get(item.creator)?.pic }} />}
            /> */}
        <Card.Title
          // Did we remove bet types?
          title={item.bet_type ? item.bet_type + ", " : "" + item.status}
          subtitle={
            item?.date_start?.toDate()?.toLocaleString() +
            " to " +
            item?.date_end?.toDate()?.toLocaleString()
          }
        />
        <Card.Content>
          <View style={BetViewComponentStyles.container}>
            <Avatar.Image
              size={75}
              source={{ uri: userPics?.get(item.creator)?.pic }}
            />
            <View style={BetViewComponentStyles.right}>
              <Paragraph style={{ fontSize: 16, width: "80%" }}>
                {userPics?.get(item.creator)?.name +
                  " started a new bet: \n" +
                  item.bet_name}
              </Paragraph>
              <Paragraph style={{ fontSize: 16, width: "70%" }}>
                {"Wager: \n" + item.wager + "\nQuantity: " + item.wager_quan}
              </Paragraph>
            </View>
          </View>
          <BottomRowTitle />
          <View style={BetViewComponentStyles.container}>
            {item.invited_users.map((user) => {
              return (
                <Avatar.Image
                  style={{ margin: 8}}
                  key={user.id}
                  size={50}
                  source={{ uri: userPics?.get(user.id)?.pic }}
                />
              );
            })}
          </View>
        </Card.Content>
      </Card>
    );
  };
};
