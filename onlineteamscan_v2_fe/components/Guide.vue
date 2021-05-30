<template>
  <v-expansion-panels>
    <v-expansion-panel
      v-for="(guide,i) in guides"
      :key="i"
    >
      <v-expansion-panel-header>
        {{guide.title }}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div v-if="guide.video" class="video elevation-1">
          <div class="responsive">
            <iframe
              width="100%"
              height="100%"
              :src="`${guide.video}`"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: "Guide.vue",
  data() {
    return {
      guides: [
        {
          title: "Hoe maak ik een nieuw team aan?",
          video: "/Guides/GuideCreateTeam.mp4"
        },
        {
          title: "Hoe verander ik de naam van mijn team?",
          video: "/Guides/GuideEditTeam.mp4"
        },
        {
          title: "Hoe verwijder mijn team?",
          video: "/Guides/GuideDeleteTeam.mp4"
        },
        {
          title: "Hoe voeg ik een lid toe aan mijn team?",
          video: "/Guides/GuideAddTeamMember.mp4"
        },
        {
          title: "Hoe bewerk ik een lid van mijn team?",
          video: "/Guides/GuideEditMember.mp4"
        },
        {
          title: "Hoe zet ik een lid van mijn team op niet actief?",
          video: "/Guides/GuideSetMemberNotActive.mp4"
        },
        {
          title: "Hoe verwijder ik een lid van mijn team?",
          video: "/Guides/GuideDeleteMember.mp4"
        },
        {
          title: "Hoe start ik een teamscan?",
          video: "/Guides/GuideStartTeamscan.mp4"
        },
        {
          title: "Hoe selecteer ik het resultaat van een teamscan?",
          video: "/Guides/GuideSelectTeamscanResult.mp4"
        },
        {
          title: "Wat is het resultaat van een teamscan?",
          video: "/Guides/GuideResultTeamscan.mp4"
        },
      ]
    }
  }
}
</script>

<style scoped>
.responsive {
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
  position: relative;
}

.responsive iframe {
  position: absolute;
  width: 100%;
  height: 100%;
  border: none;
}
.video {
  max-width: 800px;
  margin: 10px auto;
}
</style>
