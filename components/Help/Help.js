import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import HelpSection from './HelpSection';
export default () => {
  return (
    <ScrollView style={styles.container}>
      <HelpSection
        type="Instagram"
        instructions={[
          '1. Tap (iPhone) or(Android) above the post.',
          '2. Tap Copy Link.',
          '3. Paste the copied link here.',
        ]}
      />

      <HelpSection
        type="Facebook"
        instructions={[
          '1. Open your Facebook app.',
          '2. Go to the post',
          '3. Click on "Share" and select "Copy link"',
        ]}
      />

      <HelpSection
        type="Twitter"
        instructions={[
          '1.Tap the share icon ( on iOS, on Android).',
          '2. Then tap Tweet this Moment to see the URL in the Tweet compose view.',
          '3. From this menu pop-up you also have the option to copy the URL link.',
        ]}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
  },
});
