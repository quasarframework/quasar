<template>
  <div class="q-layout-padding">
    <q-btn color="primary" label="Refresh" @click="refresh" class="q-my-lg" />

    <div class="row items-start">
      <q-img
        v-for="image in images"
        :key="image.id"
        :src="image.src"
        :ratio="4/3"
        class="col-6 col-sm-4 col-md-3"
      >
        <template v-slot:error>
          <div class="absolute-bottom text-body1 text-center text-negative">
            {{ image.bogus === true ? 'Bogus image' : 'Error on loading' }}
          </div>
        </template>
      </q-img>
    </div>
  </div>
</template>

<script>
const imageUrls = [
  'https://storage.googleapis.com/stackoverflowbucket/1558365042991_4037795_x?GoogleAccessId=storage-signurl%40pqbq-224713.iam.gserviceaccount.com&Expires=1559001599&Signature=CU6djyc1Di94vJ5N5QtEgd5bl05iJfER2KS0Oz%2B2th0pE46C39Hc%2F276KSpcHXIq839FeS2fAsSMfDHxeVUazotNqz8U1NjN6fCSDPvxfmItbvxxnnB1HcqjWdKAPbGYELbR1M6%2B1qgp%2Fr89FHtfAbYsw1IRZmlYXRx0hIzNnk24oqJkUXUyvjBZf8GWJ%2BI9inV7JAbqs2dAs9p7KoJ5nl6vPVinD8xGM2iU2JN8SBWXULfq0eOnO66biDZiVjPhXtXrdlPNNMybuZcQ3Ydn%2FMljheXj6xUhlqAMcehB60Hus%2FgNbdg4ivRcoJSbVBfErxkAzf6SOGwNTn3nCAOtZA%3D%3D',
  'https://storage.googleapis.com/stackoverflowbucket/1558365168582_4037795_x?GoogleAccessId=storage-signurl%40pqbq-224713.iam.gserviceaccount.com&Expires=1559001599&Signature=I3fEw%2FDk41fE4LBlKFSAiHKpMGa1cJPYuS%2BeAZuLm0m7n4xtXd%2Booq3t1eCE5Q5V2xuHpwX3Oem93BY1LUe2EYrvo4tcHX7kh8jkKmxWD2Pod8qBEVAoOojbSiiD6dkMysVB4QdK9LN%2FyYXDnwd1w%2FP8RO3vVNXg9hwhgjOOtIRglDQAdtDkdfx2pgD5Y%2F%2BVnVsyq3oq0hijLJLontINcMPMciOVEiSGssIpp4jt6sw1zzdgbXsZtVlsphexKRVRWFCr7RAkNMRh73W6ivxU3Pjj4rhanxXofXeorlQSWEtVgHtwDNdmeQp4w%2F9%2FnzISTZHlYtRpVvcT%2FJLqNrf30w%3D%3D',
  'https://storage.googleapis.com/stackoverflowbucket/1558365151285_4037795_x?GoogleAccessId=storage-signurl%40pqbq-224713.iam.gserviceaccount.com&Expires=1559001599&Signature=EEM03nCDwzn2g308T2f%2Fnvx0746QIjl7WqQQ8dqthDElE2LJxjnkYomxx8a34vv1DKgtzL39erBcCI%2Bwv4qFCjPsUw8pKvTJ%2Bju%2FAQluVstalk3p63Cb5n6XVi4fQCafpegPHWMwU7Qrfk9tRy2oq38e1j2DNAH3fRmi1VA86D9NxMtKqgcYyHiXxPp0YEWedgaGoyIFWp5AOMfQh2mvFzm7EmBCxGEpfffrurk8dlaoPXHguvhpk5MeTJIPggnkTEV6yxQGJ3H5kgOi7d4ddc1sdCcyzMcs1K8m9njvsX6%2F4VXIwLFA3xC1Wgb00dBduh69SrjSYR%2FLfdlfVaC0hw%3D%3D',
  'https://storage.googleapis.com/stackoverflowbucket/1558365161406_4037795_x?GoogleAccessId=storage-signurl%40pqbq-224713.iam.gserviceaccount.com&Expires=1559001599&Signature=aehkv02bvUrGcrukJUiTkFmNsgbkZpDnSQ7Hyu4mR9D1HhsqGErPjF9eckUgbStCdiPCAaskuQx25uS2Cogr78halTMzyHyNudKFK3wlkHa7XnS71tEhO0wXs41uwifQkihsZqx1Fz9r%2FDCChRqH77sjHZU%2FF%2F95ry7FdvZ3SpuWc1jqND3ujNRICgwuXoof2K9dRolbCSQAVPGeDOAw0LTdVF7kfyokWtiMA84pTMwudRYQrGR6bSJwSiankkxmiYIB%2BblNzpArAJWZgdgE0z6BvwL%2BLyZ%2FvFNidXyjen90bSgXbqmOsDUy0Pw7nVhzfTJc6sDMTWjicjZ2RpYM2Q%3D%3D',
  'https://storage.googleapis.com/stackoverflowbucket/1558365139628_4037795_x?GoogleAccessId=storage-signurl%40pqbq-224713.iam.gserviceaccount.com&Expires=1559001599&Signature=daOo77EruZ6kRJFHWjZt8AfQVZ21tMV61Twtd7sffjF2Unxf2mdDau10Yp8UbFnmPR0ja%2FWahKMMsBVRIY70vqMx0AlhhMaHuxizpfTaNMLAipujA7Ji4sfXXocCWQg%2FnS0ttSXKpBTt9o04LKeIuk6bgnL9vsxI%2BxQj0TAoMSVPzLnS7mZv%2FCo2zsvMWbiEA1dCgky23znaEek1z9sXQVDMFELayviOLumae3SsjQCRDC12AwCJZS3GVysIuUC49uJFpKsP1iQOV%2BrvEhXEDB7RkKmZ4%2BCKwVAWdcpAckkuvn4I4tv8KodQ99%2Fg40A2nVyjheQaHC5ciAc7y0pbzg%3D%3D',
  'https://storage.googleapis.com/stackoverflowbucket/1558365135807_4037795_x?GoogleAccessId=storage-signurl%40pqbq-224713.iam.gserviceaccount.com&Expires=1559001599&Signature=VxvP%2BGu6W4cVB8pLbADgYqqdQc4L2eGq2kuxnRECzo%2FCn1RxvqSTSb0ijzCFHOhgyKVPRkfQKm78kk5nnQmFLv9PuRroBdydG2q3w1%2FRpjk5gWOB11vLvTUokzeaQFP93bsEuMWc5Q3GHE6ElnaDhrqvSTTpr5De3A2CW%2BsuxTUO9RozA8K7adMdPHfW0JRRPeMX%2FQs%2Fh%2B5eM10hh5s259CHGr%2FF1MRbO8Vrk2PSzw3IN9da%2Bh9jAYT3a9OYX3%2BLvJYhmrMpl39mfXIC%2BsfAZtYZ2ZbtxWHgcaW8ORdHwPzZShnzocf%2FG0Ebqnn%2BfCZBjvzUO9VR%2Fy2fVBxKQ33wZw%3D%3D',
  'https://storage.googleapis.com/stackoverflowbucket/1558365132315_4037795_x?GoogleAccessId=storage-signurl%40pqbq-224713.iam.gserviceaccount.com&Expires=1559001599&Signature=KBf%2B4GT1vhhSuLAo%2BzBPndn4M5Ffwtg0urk1fnCR8JiPZ8xL%2FUIYpHCDpbKL1S2hIbcE146oZz414AwLTVjlJjj1sn39cP19okIyJQLSiDqrTCUU6wuB4wGOoprwuI%2B5aI%2FrdLwA48kxaZkK60cDJ4OigWJ%2BhYeFP8PsSLt%2F6DD32L0Pz48lQSJP%2FlNLLQN3KEcZN038r7vmYvT4q5xphRujnxXA9AtIc65Og52AxaJZLAoRUyEIzn5%2FcN4sTtxarYqo6dNCzF7axUmYbLDJ%2FkV%2FQ5ZHbA519iJ8rP2%2FxZhh50YMe3VEqPmqXiUZyDSDAmgteWULytIwP6sRTGPxng%3D%3D',
  'https://storage.googleapis.com/stackoverflowbucket/1558365128706_4037795_x?GoogleAccessId=storage-signurl%40pqbq-224713.iam.gserviceaccount.com&Expires=1559001599&Signature=DvL7iV%2FWHMfwT69tNzLVTE4kmLrxpDKl4hIT7mG0tmOpELFqyw25jwCjLExEsjkUIU%2FJkDXW4MIHsPfINpiKYFTaJO5%2BsCM%2FAm0m2JjaVj2Ans%2FH5d%2BFs5gb5eB9XujXLnjD7bMC%2FqBW6Ppe9kFT7rhbyIRTMiiKDlBFa1E0djsZ34W6imz1DPoP%2B7nPCMjF%2FMOwsj9DAAWa2zcSbHo0IjnKfoufeBOLsARIlcfOSc3auPnwONIWzYoeSkp1%2FQVN8RPEISnLRWSJlP2WqahFsEeU82kR%2FPtTtBzgv3lqETbpTHMTTu1lSgGheWsLBOXZ8WP5Joe46Q6pnDTfsxkpuA%3D%3D',
  'https://storage.googleapis.com/stackoverflowbucket/1558365124672_4037795_x?GoogleAccessId=storage-signurl%40pqbq-224713.iam.gserviceaccount.com&Expires=1559001599&Signature=Tg7hJ6ScxCJHTE1%2BErUoQmBt7QBk1Xlqy9%2BPsTwmFIqSREF9ocOufVnKETxPqmtpxx39PVCoSp6wNBI4zG5f2fv4Jue9w%2FkREqKc3XhElQb%2BaA0aOE13i25JNZv7FgUWTwfCRtqK9aFacLOM5k%2FrEcuAtSXAOgEWg1ug5ce%2BsMuZ1yLDvMSR7nWtJtc4t11KgpLmidXmiMBQLbqXak47uUeddmXIrnd6Z6kXgJ%2B07q74tQIitiRJOzWJTtNrqcYzOZiLrTg%2FKnLRgCS7jsUuBQ9RgGeD5qrpymNJviNapt6ScxJTU9FDkk%2B7lxLcQ1D11D%2BXpleT3la3zX207XUaRQ%3D%3D',
  'https://storage.googleapis.com/stackoverflowbucket/1558365120483_4037795_x?GoogleAccessId=storage-signurl%40pqbq-224713.iam.gserviceaccount.com&Expires=1559001599&Signature=hATHgimBDebfgYYfGo5NU4%2FTUqY7rbtG9cFzs3L9OY4OxoynmtqIiQJIEC1sP%2BvqDMfLGF43pKD6IU%2B6DR3OsCP54%2BR4DS8DPRpMgF6i58VrQPvUwFQWT6Grrn1lwPM0Zzu%2BbAZhRQpbRm1LdBz2hhhdgEKhoA41TCHPkWJ190oFKv%2B6MjcSgy8aUQ3Inaa7RljYVuK9bUpYDC1ld2xXoXTcKQHCiZYNuzf7d9wGp7gdD13%2FOndt7pNffL1HvMIiSSeG0imxI%2BTyj49Jnobm587fH0jzqXjuci%2B3pK24QQfjoqvd5cd7NQiCmMQYua62lvxfWCWMMT1kjbaBCgdv8A%3D%3D',
  'https://storage.googleapis.com/stackoverflowbucket/1558365116060_4037795_x?GoogleAccessId=storage-signurl%40pqbq-224713.iam.gserviceaccount.com&Expires=1559001599&Signature=SY4IZW03J%2FTfYbvPzWx8wu8rh0ep7XyHif71EJEIucsxgaPERfKTRAOi4hDVW6bZqTv0KsM%2Bajy0N%2B1f4m5JdzDTFkr%2B9aRxAYgyJVY4z0qtw3ydVsfLMxOeBz7ZfXT5DNgGH50U2RbBzA4FMa6FFfWUFf5Nbo%2F%2BX5tcHNvZ%2BUd9e%2FCujZ4Scdgb%2Fpxv05fzqWUpKCb9Vc2c8r94s0oyeDoSjHkDAEr9YQmkvHrgR1a8XtgALJ%2F60AuUb683cuRUknW4uJ0cMSt8ube9UJIQwToO%2F97ueKoGuh69ofpKCZt3KhLxVpFzqnV6eEc4%2Fj6Pm6oqr9EB2yQX4n4UPXUFng%3D%3D',
  'https://storage.googleapis.com/stackoverflowbucket/1558365111980_4037795_x?GoogleAccessId=storage-signurl%40pqbq-224713.iam.gserviceaccount.com&Expires=1559001599&Signature=blNuSzn6w3iIP81MVD5hhcKYMIEcEPZImD5%2BWSiMTTK5jSWsQskOLP8a7Ji%2BQP0UB2QuyniOAYCUh6nfF1gaYJH9M65uKKNMB4JdIlf1s%2BkaHOM7cMdC6hM%2Bbar2U%2BDqXx9a8pb3wNlQtzHFR%2BE%2BxDi4LenivRSZFBQXS5lIBhP2nvHwii5B854ory4ZPQI%2FUeSYTYvwUTm370hbhoWrye7p1PeVweBv9QT7LanWZg9ZUHZbrywuO0%2FlHvLqxzvsbI1IoUhvUpqN2TrxggWZV8u5U4igbUDrRFjq8j1PkRQHxDR2XM%2Fb5rM7NtSMkP85BBBVp8ZZUeu%2F9CgeyS7QaA%3D%3D'
]

const generateImageList = () => {
  const
    length = imageUrls.length,
    list = []

  for (let i = length; i >= 0; i--) {
    list.push({
      id: i + Math.random(),
      bogus: i === length,
      src: i === length ? 'https://bogu.bogus' : imageUrls[ i ]
    })
  }

  return list
}

export default {
  data () {
    return {
      images: generateImageList()
    }
  },

  methods: {
    refresh () {
      this.images = generateImageList()
    }
  }
}
</script>
