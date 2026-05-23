import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
});

const ResumePDF = ({ data, accentColor }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={[styles.title, { color: accentColor }]}>
          {data.personal_info?.full_name || 'Your Name'}
        </Text>
        <Text style={styles.text}>
          {data.personal_info?.email} | {data.personal_info?.phone} | {data.personal_info?.location}
        </Text>
      </View>

      {data.professional_summary && (
        <View style={styles.section}>
          <Text style={[styles.subtitle, { color: accentColor }]}>Professional Summary</Text>
          <Text style={styles.text}>{data.professional_summary}</Text>
        </View>
      )}

      {data.experience && data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.subtitle, { color: accentColor }]}>Experience</Text>
          {data.experience.map((exp, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={styles.text}>
                {exp.position} at {exp.company} ({exp.start_date} - {exp.end_date})
              </Text>
              <Text style={styles.text}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {data.education && data.education.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.subtitle, { color: accentColor }]}>Education</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={styles.text}>
                {edu.degree} in {edu.field_of_study} from {edu.school} ({edu.graduation_year})
              </Text>
            </View>
          ))}
        </View>
      )}

      {data.project && data.project.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.subtitle, { color: accentColor }]}>Projects</Text>
          {data.project.map((proj, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={styles.text}>{proj.name}: {proj.description}</Text>
              <Text style={styles.text}>Technologies: {proj.technologies}</Text>
            </View>
          ))}
        </View>
      )}

      {data.skills && data.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.subtitle, { color: accentColor }]}>Skills</Text>
          <Text style={styles.text}>{data.skills.join(', ')}</Text>
        </View>
      )}
    </Page>
  </Document>
);

export default ResumePDF;
