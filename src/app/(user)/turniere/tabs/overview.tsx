import { View, Text, ActivityIndicator, FlatList, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useTournamentsWithInfiniteScroll } from '@/api/turniere';
import { useDeleteBookmarkSubscription, useInsertBookmarkSubscription, useInsertCompetitionRegistrationSubscription } from '@/api/turniere/subscriptions';
import BaseScreen from '@/components/BaseScreen';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'expo-router';
import { FadeIn } from 'react-native-reanimated';
import KalenderCard from '@/components/Custom/TurnierCard/KalenderCard';
import SVG_inactive_Bookmark from '@assets/images/material-symbols_bookmark-outline.svg'
import SVG_active_Bookmark from '@assets/images/active_bookmark.svg'
import { Tables } from '@/types';
import { useDeleteBookmarker, useInsertBookmarker } from '@/api/turniere/bookmarker';
const OverviewTournamentsScreen = () => {
  const { playerProfile } = useAuth();
  if (!playerProfile) {
    return <Text>Spielerprofil konnte nicht geladen werden</Text>
  }
  useInsertCompetitionRegistrationSubscription();
  useInsertBookmarkSubscription(playerProfile.id)
  useDeleteBookmarkSubscription(playerProfile.id)
  const { mutate: insertBookmarker } = useInsertBookmarker()
  const { mutate: deleteBookmarker } = useDeleteBookmarker(playerProfile?.id)
  const router = useRouter();


  const { data: t, fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    status,
    error, isLoading } = useTournamentsWithInfiniteScroll();

  if (!playerProfile) {
    return <Text>Please log in to see your registered tournaments.</Text>;
  }


  const handleOnPress = (id: number) => {
    console.log("ID", id);

    router.push(`(user)/turniere/staffeln/${id}`);
  }

  const handleBookmarker = (bookmarked: boolean, tournament: Tables<'tournaments'>) => {
    if (!bookmarked) {
      const newBookmarker = {
        player_id: playerProfile.id,
        tournament_id: tournament.id
      }
      insertBookmarker(newBookmarker)
    } else if (bookmarked) {
      deleteBookmarker(tournament.id)
    }


  }

  if (isLoading) {
    return <ActivityIndicator size='large' style={{ position: 'absolute', left: '45%', top: '50%' }} />;
  }

  if (!t) {
    return <Text>Du hast dich bisher für keine Turniere angemeldet</Text>;
  }

  const tournaments = t.pages.flatMap(page => page.data);
  return (
    <BaseScreen entering={FadeIn} ellipse={false} marginBottom={0}>
      {!isLoading && (
        <SafeAreaView style={styles.container}>
          <FlatList
            style={{ zIndex: 1000, paddingTop: 20 }}
            data={tournaments}
            keyExtractor={(item) => item.tournament.id.toString()}
            renderItem={({ item }) => (
              <View>
                <View style={styles.overlay}>
                  <TouchableOpacity onPress={() => handleBookmarker(item.bookmarked, item.tournament)}>
                    {item.bookmarked ? <SVG_active_Bookmark /> : <SVG_inactive_Bookmark />}
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => handleOnPress(item.tournament.id)} style={styles.itemContainer}>
                  <KalenderCard data={item.tournament} />
                </TouchableOpacity>
              </View>
            )}
            showsVerticalScrollIndicator={false}

            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage && !isFetching) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.6}
            ListFooterComponent={<View style={styles.footer} />}
          />
        </SafeAreaView>
      )}
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
  container: {
    top: -5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    marginBottom: 10, // Abstand zwischen den Elementen
  },
  footer: {
    height: 130, // Höhe des zusätzlichen Platzes am Ende der Liste
  },
  rightAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
  },
  overlay: {
    width: 50, height: 50,
    //borderWidth: 1, borderColor: 'blue',
    position: 'absolute',
    right: 0,
    zIndex: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
});


export default OverviewTournamentsScreen