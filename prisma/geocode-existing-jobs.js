const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function geocode(address) {
  const query = encodeURIComponent(address + ', Belgique')
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=be`,
    { headers: { 'User-Agent': 'Skillio/1.0 (hello@skillio.be)' } }
  )
  const data = await res.json()
  if (data && data.length > 0) {
    return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) }
  }
  return null
}

async function main() {
  const jobs = await prisma.job.findMany({
    where: { OR: [{ latitude: null }, { longitude: null }] }
  })

  console.log(`${jobs.length} offre(s) à geocoder...`)

  for (const job of jobs) {
    const addressToGeocode = job.address || job.location
    if (!addressToGeocode) continue

    const coords = await geocode(addressToGeocode)
    if (coords) {
      await prisma.job.update({
        where: { id: job.id },
        data: { latitude: coords.latitude, longitude: coords.longitude }
      })
      console.log(`✓ ${job.title} — ${addressToGeocode} → ${coords.latitude}, ${coords.longitude}`)
    } else {
      console.log(`✗ ${job.title} — coordonnées introuvables`)
    }

    // Pause pour respecter la limite de Nominatim (1 req/seconde)
    await new Promise(r => setTimeout(r, 1100))
  }

  console.log('✅ Terminé')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())